for i in *.mp4;
do
	ffmpeg -i "$i" -vf scale=1080:-2 "${i%.mp4}_temp.mp4";
	mv "$i" "${i%.mp4}_old.mp4";
	mv "${i%.mp4}_temp.mp4" "$i"
done
