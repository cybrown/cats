//
// Copyright (c) JBaron.  All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

module Cats.Menu {


    /**
     * This class creates the main menubar. 
     */
    class Menubar {


        fontSizes = [8, 10, 12, 14, 16, 18, 20, 24];

        themes = [
                    { theme: "cats", label: "CATS" },
                    { theme: "chrome", label: "Chrome" },
                    { theme: "clouds", label: "Clouds" },
                    { theme: "crimson_editor", label: "Crimson Editor" },
                    { theme: "dawn", label: "Dawn" },
                    { theme: "dreamweaver", label: "Dreamweaver" },
                    { theme: "eclipse", label: "Eclipse" },                    
                    { theme: "github", label: "GitHub" },
                    { theme: "solarized_light", label: "Solarized Light" },
                    { theme: "textmate", label: "TextMate" },
                    { theme: "tomorrow", label: "Tomorrow" },
                    { theme: "xcode", label: "XCode" },

                    { theme: null, label: "seperator dark themes" },
                    { theme: "ambiance", label: "Ambiance" },
                    { theme: "clouds_midnight", label: "Clouds Midnight" },
                    { theme: "cobalt", label: "Cobalt" },
                    { theme: "idle_fingers", label: "idleFingers" },
                    { theme: "kr_theme", label: "krTheme" },
                    { theme: "merbivore", label: "Merbivore" },
                    { theme: "merbivore_soft", label: "Merbivore Soft" },
                    { theme: "mono_industrial", label: "Mono Industrial" },
                    { theme: "monokai", label: "Monokai" },
                    { theme: "pastel_on_dark", label: "Pastel on dark" },
                    { theme: "solarized_dark", label: "Solarized Dark" },
                    { theme: "twilight", label: "Twilight" },
                    { theme: "tomorrow_night", label: "Tomorrow Night" },
                    { theme: "tomorrow_night_blue", label: "Tomorrow Night Blue" },
                    { theme: "tomorrow_night_bright", label: "Tomorrow Night Bright" },
                    { theme: "tomorrow_night_eighties", label: "Tomorrow Night 80s" },
                    { theme: "vibrant_ink", label: "Vibrant Ink" },
        ];


        constructor() {
            var menubar = new GUI.Menu({ type: 'menubar' });
            var getCmd = Cats.Commands.getMenuCommand;
            var CMDS = Cats.Commands.CMDS;

            var file = new GUI.Menu();
            file.append(getCmd(CMDS.file_new));
            file.append(new GUI.MenuItem({ type: "separator" }));
            file.append(getCmd(CMDS.file_save));
            file.append(getCmd(CMDS.file_saveAs));
            file.append(getCmd(CMDS.file_saveAll));
            file.append(new GUI.MenuItem({ type: "separator" }));
            file.append(getCmd(CMDS.file_close));
            file.append(getCmd(CMDS.file_closeAll));
            file.append(getCmd(CMDS.file_closeOther));
            file.append(new GUI.MenuItem({ type: "separator" }));
            file.append(getCmd(CMDS.ide_quit));

            var edit = new GUI.Menu();
            // edit.append(this.editorCommand("undo"));
            edit.append(getCmd(CMDS.edit_undo));
            edit.append(getCmd(CMDS.edit_redo));
            /*
            edit.append(new GUI.MenuItem({ type: "separator" }));
            edit.append(getCmd(CMDS.edit_cut));
            edit.append(getCmd(CMDS.edit_copy));
            edit.append(getCmd(CMDS.edit_paste));
            */
            edit.append(new GUI.MenuItem({ type: "separator" }));
            edit.append(getCmd(CMDS.edit_find));
            edit.append(getCmd(CMDS.edit_findNext));
            edit.append(getCmd(CMDS.edit_findPrev));
            edit.append(getCmd(CMDS.edit_replace));
            edit.append(getCmd(CMDS.edit_replaceAll));
            
            edit.append(new GUI.MenuItem({ type: "separator" }));
            edit.append(getCmd(CMDS.edit_toggleRecording));
            edit.append(getCmd(CMDS.edit_replayMacro));


            var source = new GUI.Menu();
            source.append(getCmd(CMDS.edit_toggleComment));
            source.append(getCmd(CMDS.edit_indent));
            source.append(getCmd(CMDS.edit_outdent));
            source.append(getCmd(CMDS.source_format));

            var refactor = new GUI.Menu();
            refactor.append(getCmd(CMDS.refactor_rename));

            var navigate = new GUI.Menu();
            navigate.append(getCmd(CMDS.navigate_declaration));
            navigate.append(getCmd(CMDS.navigate_references));
            navigate.append(getCmd(CMDS.navigate_occurences));
            navigate.append(getCmd(CMDS.navigate_implementors));

            var proj = new GUI.Menu();
            proj.append(getCmd(CMDS.project_open));
            proj.append(getCmd(CMDS.project_close));
            proj.append(new GUI.MenuItem({ type: "separator" }));
            proj.append(getCmd(CMDS.project_build));
            var buildOnSaveItem = new GUI.MenuItem({ label: 'Build on Save', checked: false, type: "checkbox" });
            proj.append(buildOnSaveItem);
            buildOnSaveItem.click = () => {
                console.log("Clicked: " + buildOnSaveItem.checked);
                IDE.project.config.buildOnSave = buildOnSaveItem.checked;
            }
            proj.append(getCmd(CMDS.project_refresh));
            proj.append(getCmd(CMDS.project_properties));
            proj.append(getCmd(CMDS.project_dependencies));


            var run = new GUI.Menu();
            run.append(getCmd(CMDS.project_run));
            run.append(getCmd(CMDS.project_debug));


            var window = new GUI.Menu();
            window.append(new GUI.MenuItem({ label: 'Theme', submenu: this.createThemeMenu() }));
            window.append(new GUI.MenuItem({ label: 'Font size', submenu: this.createFontSizeMenu() }));
            window.append(new GUI.MenuItem({ label: 'Views', submenu: this.createViewMenu() }));

            var help = new GUI.Menu();
            help.append(getCmd(CMDS.help_shortcuts));
            help.append(getCmd(CMDS.help_processInfo));
            help.append(getCmd(CMDS.help_devTools));
            help.append(getCmd(CMDS.help_about));
            
            menubar.append(new GUI.MenuItem({ label: 'File', submenu: file }));
            menubar.append(new GUI.MenuItem({ label: 'Edit', submenu: edit }));
            menubar.append(new GUI.MenuItem({ label: 'Source', submenu: source }));
            menubar.append(new GUI.MenuItem({ label: 'Refactor', submenu: refactor }));
            menubar.append(new GUI.MenuItem({ label: 'Navigate', submenu: navigate }));
            menubar.append(new GUI.MenuItem({ label: 'Project', submenu: proj }));
            menubar.append(new GUI.MenuItem({ label: 'Run', submenu: run }));
            menubar.append(new GUI.MenuItem({ label: 'Window', submenu: window }));
            menubar.append(new GUI.MenuItem({ label: 'Help', submenu: help }));
            
            var win = GUI.Window.get();
            win.menu = menubar;
            
        }
         
        private enableFind() {
            window.open('findreplace.html', '_blank');
        }

        private actionFind() {
            var input = <HTMLInputElement>document.getElementById("findText");
            IDE.mainEditor.aceEditor.find(input.value, {}, true);
        }

        private actionReplace() {
            var findText = <HTMLInputElement>document.getElementById("findText");
            var replaceText = <HTMLInputElement>document.getElementById("replaceText");
            var options = {
                needle: findText.value
            };
            IDE.mainEditor.aceEditor.replace(replaceText.value, options);
        }

        private createFontSizeMenu() {
            var getCmd = Cats.Commands.getMenuCommand;
            var CMDS = Cats.Commands.CMDS;
            var menu = new GUI.Menu();
            this.fontSizes.forEach((size: number) => {
                var item = getCmd(CMDS.ide_fontSize,size+"px",size);
                menu.append(item);
            });
            return menu;
        }

        private createViewMenu() {
            var getCmd = Cats.Commands.getMenuCommand;
            var CMDS = Cats.Commands.CMDS;
            var menu = new GUI.Menu();
            var views = [
                {id:"north",name:"Toolbar"},    
                {id:"south",name:"Statusbar"}
            ]
            views.forEach((view) => {
                    var item = getCmd(CMDS.ide_toggleView,view.name,view.id);
                    menu.append(item);
            });
            return menu;
        }

        private createThemeMenu() {
            var getCmd = Cats.Commands.getMenuCommand;
            var CMDS = Cats.Commands.CMDS;
            var menu = new GUI.Menu();
            this.themes.forEach((theme) => {
                if (theme.theme) {
                    var item = getCmd(CMDS.ide_theme,theme.label,theme.theme);
                    menu.append(item);
                } else {
                    menu.append(new GUI.MenuItem({
                        type: "separator"
                    }));
                }
            });
            return menu;
        }

        private enableReplace() {
            document.getElementById("findArea").style.display = "block";
            document.getElementById("replaceArea").style.display = "block";
        }


    }

    export function createMenuBar() {
        new Menubar();
    }

}

