# gallery-by-react
 one photo gallery based on react 
https://xskdjs1995.github.io/gallery-by-react/
npm run dist 打包
npm run serve：dist 

git add dist
git commit -m"xxx"
git subtree push --prefix=dist origin gh-pages  上传到远程分支上 
（  在打包前 把default中的 绝对路径改成 assets/    把src 路径下的 index.html 中改为  ./assets/app.js）
