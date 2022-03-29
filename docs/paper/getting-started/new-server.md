# Setting up a server
## Windows

  
1. Get CraftBukkit's latest recommended build:

2. Put the .jar file in the directory you'd like the server to run from

3. Open a text editor such as Notepad and type:

`java -jar craftbukkit.jar`  
`PAUSE`

  
4. Save the document as run.bat (not as a .txt) in the same directory
as craftbukkit.jar.

  
5. Double click run.bat and you're away!

6. To shut down, issue the "stop" command in console.
  
If you see "'Java' is not recognized as an internal or external command,
operable program or batch file." then you need to reinstall Java. Still
get this error? Follow this [guide](../../common/java-install.md) to adding Java to your system
path.

## Linux

  
1. Get CraftBukkit's latest build:

2. Put the .jar in a folder, for this example we'll use a generic one:
~/craftbukkit

3. Move to the above directory in terminal with 'cd ~/craftbukkit'

4. Create a new file in the minecraft folder and name it craftbukkit.sh

5. Edit the file and paste this into it:

```bash
    #!/bin/sh
     BINDIR=$(dirname "$(readlink -fn "$0")")
     cd "$BINDIR"
     java -jar craftbukkit.jar
```

  
6. Make the file executable, either by running "chmod +x
~/craftbukkit/craftbukkit.sh" in a terminal, or by changing the
permissions in the file's properties.
  
7\. Then, in terminal, type '~/craftbukkit/craftbukkit.sh' to run to
start the server. 
  
8\. When you're done playing around, issue the "stop" command in
console.

If you plan to run the server more permanently an init script like this
one [recommended](https://github.com/Ahtenus/minecraft-init)

If you want to run your server with screen, you can use a script like
