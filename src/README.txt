Release notes 

=== R14-V1.14.0 ===
	This version is not compatible with R13 regarding students data. The parameters of file_rewrite_pluginfile_urls on savePersonalNote have changed and the impact will be that students will no longer see their images. So R14 should only be installed in a new course.
	
	In this version, the backend files PersistCtrlCahierTraces and 	ApiCahierTraces were finally removed from local_recitcommon. This implies that only installations with R13 can move to R14. The installations of R12 or less which try to go directly to R14 will have a problem with required files.
	
	