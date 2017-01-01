# Node_webkit_GDB
A user interface for GNU C Debugger GDB.

###Last Working
* fef0800bcd3bddb03fffc77e104906a4e562fd88

###Prerequisites
* gcc
* gdb
* nodewebkit(now known as nw) globally installed

#How to use
Below are the steps to use this tool. A file named `sum.c` is given within the project directory, all the steps are shown using that.
	
* Create a executable of your c file with given command below `gcc -g -o sum.exe sum.c`.
* It will generate `sum.exe` file.
* Run `nodewebkit` command from root directry of this project.
* It will ask you to choose a file, choose the exe file generated in above steps, and click on `load exe`.

#####Note:- 
On OSX you need to codesign your gdb installation. You can follow [this](https://www.patosai.com/posts/2015/03/24/installing-gdb-on-os-x-yosemite) tutorial.