module Cats {
    
//var fs = require('fs');
var events = require('events');

export class TreeWatcher {
    
    private dirs: {[dirpath: string]: any} = {};
    private files: string[] = [];
    private initial: boolean = true;
    
    public onFileCreate(path: string): void {
        
    }
    public onFileDelete(path: string): void {
        
    }
    public onDirectoryCreate(path: string): void {
        
    }
    public onDirectoryDelete(path: string): void {
        
    }
    public onError(error: any): void {
        
    }
    
    private hasDirectory (directory: string) {
        return this.dirs.hasOwnProperty(directory);
    }
    
    private addFile (filepath: string) {
        if (this.files.indexOf(filepath) == -1) {
            this.files.push(filepath);
            if (!this.initial) {
                this.onFileCreate(filepath);
                //this.emit('file.create', filepath);
            }
        }
    }
    
    private removeFile (filepath: string) {
        var index = this.files.indexOf(filepath);
        if (index != -1) {
            if (index != (this.files.length - 1)) {
                this.files[index] = this.files[this.files.length - 1];
            }
            this.files.pop();
            this.onFileDelete(filepath);
            //this.emit('file.delete', filepath);
        }
    }
    
    public setDirectory (directory: string) {
        this.clear();
        this.addDirectory(directory);
    }
    
    private addDirectory (directory: string) {
        if (!this.hasDirectory(directory)) {
            if (!this.initial) {
                this.onDirectoryCreate(directory);
                //this.emit('directory.create', directory);
            }
            this.dirs[directory] = this.createWatcherForPath(directory);
            OS.File.readDir(directory)
                .forEach(fileinfo => {
                    if (fileinfo.isDirectory) {
                        this.addDirectory(fileinfo.fullName);
                    } else if (fileinfo.isFile) {
                        this.addFile(fileinfo.fullName);
                    }
                });
        }
        this.initial = false;
    }
    
    private removeDirectory (directory: string): void {
        Object.keys(this.dirs).forEach(dir => {
            if ((dir == directory) || (dir.indexOf(directory + '/') == 0)) {
                this.onDirectoryDelete(dir);
                //this.emit('directory.delete', dir);
                this.dirs[dir].close();
                delete this.dirs[dir];
            }
        });
        this.files.forEach(filepath => {
            if (filepath.indexOf(directory + '/') == 0) {
                this.removeFile(filepath);
            }
        });
    }
    
    private clear (): void {
        for (var dirpath in this.dirs) {
            if (this.dirs.hasOwnProperty(dirpath)) {
                this.removeDirectory(dirpath);
            }
        }
    }
    
    private removeFileOrDirectory(path: string): void {
        this.removeDirectory(path);
        this.removeFile(path);
    }
    
    private createWatcherForPath (dirpath: string): any {
        var watcher = OS.File.watch(dirpath);
        watcher.on('change', (event, filename) => {
            if (filename == null) {
                try {
                    
                    OS.File.readDir(dirpath)
                        .filter(fileinfo => {
                            try {
                                OS.File.stat(fileinfo.fullName);
                                return true;
                            } catch (e) {
                                return false;
                            }
                            return false;
                        })
                        .forEach(fileinfo => {
                            this.removeFileOrDirectory(fileinfo.fullName);
                        });
                } catch (e) {
                    this.removeFileOrDirectory(dirpath);
                }
            } else {
                try {
                    var path = dirpath + '/' + filename;
                    var stats: any;
                    stats = OS.File.stat(path);
                    if (stats.isDirectory()) {
                        this.addDirectory(path);
                    } else if (stats.isFile()) {
                        this.addFile(path);
                    }
                } catch (e) {
                    this.removeFileOrDirectory(path);
                }
            }
        });
        watcher.on('error', (error) => {
            this.onError(error);
            //this.emit('error', error);
        });
        return watcher;
    }
    
}

}
