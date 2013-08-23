module Cats {
    
var fs = require('fs');
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
    
    public hasDirectory (directory: string) {
        return this.dirs.hasOwnProperty(directory);
    }
    
    public addFile (filepath: string) {
        if (this.files.indexOf(filepath) == -1) {
            this.files.push(filepath);
            if (!this.initial) {
                this.onFileCreate(filepath);
                //this.emit('file.create', filepath);
            }
        }
    }
    
    public removeFile (filepath: string) {
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
    
    public addDirectory (directory: string) {
        if (!this.hasDirectory(directory)) {
            if (!this.initial) {
                this.onDirectoryCreate(directory);
                //this.emit('directory.create', directory);
            }
            this.dirs[directory] = this.createWatcherForPath(directory);
            fs.readdirSync(directory)
                .map(basename => {
                    return directory + '/' + basename;
                })
                .forEach(filepath => {
                    var s = fs.statSync(filepath);
                    if (s.isDirectory()) {
                        this.addDirectory(filepath);
                    } else if (s.isFile()) {
                        this.addFile(filepath);
                    }
                });
        }
        this.initial = false;
    }
    
    public removeDirectory (directory: string): void {
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
    
    public clear (): void {
        for (var dirpath in this.dirs) {
            if (this.dirs.hasOwnProperty(dirpath)) {
                this.removeDirectory(dirpath);
            }
        }
    }
    
    private createWatcherForPath (dirpath: string): any {
        var watcher = fs.watch(dirpath);
        watcher.on('change', (event, filename) => {
            var path = dirpath + '/' + filename;
            var stats: any;
            try {
                stats = fs.statSync(path);
                if (stats.isDirectory()) {
                    this.addDirectory(path);
                } else if (stats.isFile()) {
                    this.addFile(path);
                }
            } catch (e) {
                this.removeDirectory(path);
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
