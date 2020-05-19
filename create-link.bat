echo off
set pluginPath=..\moodledev2\mod\recitcahiercanada

rem remove the current link
..\outils\junction -d src

rem set the link
..\outils\junction src %pluginPath%

pause