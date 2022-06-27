Auto logs 2b2t queue speed. 

## Getting started
1. Git clone this repo
2. Run `yarn` or `npm i`
3. Run `yarn run standalone` or `npm run standalone` to start
4. Follow the login steps in the console for logging in with microsoft accounts.

## Mojang accounts
1. Set the environment variable MINECRAFT_USERNAME and MOJANG_PASSWORD. The program assumes a account is mojang when MOJANG_PASSWORD is given.
2. Start the program like described in Getting started

## Environment vars
- `DATA_PREFIX` Prefix the csv file and send data by a string. For instance `# Send by Ic3Tank`. Only really usefull if you are sending the data to next-gen.dev
- `NEXTGEN_TOKEN` Token needed to upload to `2b2q.next-gen.dev`
- `SENDQUEUEDATA` Send queue data to next-get.dev or not. `true` for yes. Defaults to false.
- `MINECRAFT_USERNAME` Microsoft/Mojang email. 
- `MOJANG_PASSWORD` Mojang password when logging in with a mojang account. If not present assumes account is microsoft.

## Docker
1. Builder the docker image `docker build --tag 2b2q .`
2. Run the docker image `docker run -it --rm -e MINECRAFT_USERNAME=<microsoft account email> -v ${PWD}/nmp-cache:/src/app/nmp-cache 2b2q`. Add `-e SENDQUEUEDATA=true -e NEXTGEN_TOKEN=<token>` to auto upload results to `2b2q.next-gen.dev`
3. Follow the login steps in the console
