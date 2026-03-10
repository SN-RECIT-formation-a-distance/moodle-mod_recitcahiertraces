$from = "moodle-mod_recitcahiertraces/src/*"
$to = "shared/recitfad4/public/mod/recitcahiertraces"
$source = "./src";

try {
    . ("..\sync\watcher.ps1")
}
catch {
    Write-Host "Error while loading sync.ps1 script." 
}