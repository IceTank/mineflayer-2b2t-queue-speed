Auto logs 2b2t queue speed. 

## Install 
1. Git clone this repo
2. Run `yarn` or `npm i`
3. Run `yarn run standalone` or `npm run standalone` to start
4. Follow the login steps in the console

## Docker
1. Builder the docker image `docker build --tag 2b2q .`
2. Run the docker image `docker run -it --rm -e MINECRAFT_USERNAME=<microsoft account email> -v ${PWD}/nmp-cache:/src/app/nmp-cache 2b2q`. Add `-e SENDQUEUEDATA=true -e NEXTGEN_TOKEN=<token>` to auto upload results to `2b2q.next-gen.dev`
3. Follow the login steps in the console
