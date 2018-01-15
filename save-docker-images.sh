mkdir -p export
echo "saving docker images to  export directory"
echo "saving postgres image.."
docker save postgres > "export/epstep_db.tar"
echo "saving django image.."
docker save epstep_web > "export/epstep_web.tar"
echo "all done."
