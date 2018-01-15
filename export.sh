images=(web db)
for image in images
do
    docker save ${image} > ${image}.tar
done
