$from = "moodle-mod_recitcahiertraces/src/*"
$to = "shared/recitfad3/mod/recitcahiertraces"
$source = "./src";

try {
    . ("..\sync\watcher.ps1")
}
catch {
    Write-Host "Error while loading sync.ps1 script." 
}