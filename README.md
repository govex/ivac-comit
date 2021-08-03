# Covid-19 Maternal Immunization Tracker (ivac-comit)
The COVID-19 Maternal Immunization Tracker (COMIT) provides a global snapshot of public health policies that influence access to COVID-19 vaccines for pregnant and lactating people. Through maps, tables, and country profiles, COMIT provides regularly updated information on global and country level policies as they respond to the dynamic state of the pandemic and emerging evidence.


This repository hosts the source code for https://www.comitglobal/org/ (the production website) and https://beta.comitglobal.org (the staging website).

## Branches
This project loosely follows the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching approach. 

| Branch | Intended purpose |
| - | - |
| [`development`](https://github.com/govex/ivac-comit/tree/development) (default) | the branch best suited for local development. Equivalent to Git Flow's `develop` branch. |
| [`beta`](https://github.com/govex/ivac-comit/tree/beta) | submit pull requests to this branch for features being prepared for release. <br> **Commits and merged pull requests to this branch automatically deploy to the [beta website](https://beta.comitglobal.org/).** |
| [`production`](https://github.com/govex/ivac-comit/tree/production) | submit pull requests to this branch for features ready for public release. <br> **Commits and merged pull requests to this branch automatically deploy to the [live website](https://www.comitglobal.org/).** Equivalent to Git Flow's `master` branch. |



## Automations

### Github actions [not yet implemented]
The data for the application is included in this repository, so Github actions is set up to pull fresh data from the data source (Airtable), transform it into the structure needed for the website, and commit those changes. Note that this means the `development`, `beta`, `production`, and other branches can be both ahead and behind each other's current commit. These actions can be triggered manually or via webhook (so a team member using airtable can trigger the update)

### Deployents to Heroku web servers
Both the `production` and `beta` branches are linked separate apps hosted on Heroku. Commits to each of these branches will trigger Heroku to pull the that branch, recompile, and restart the linked application.



# Development

## Getting started
This site uses the [nuxtjs](https://nuxtjs.org) framework. 
- Ensure NodeJS is installed. You will need at least [version 14 LTS](https://nodejs.org/en/download/) ([alternate link](https://nodejs.org/dist/)). To check which version you have:
```
node --version
```
- Clone this repository
```
git clone https://github.com/govex/ivac-comit.git [folder-name]
```
(folder name is optional; the default will be `ivac-comit`)

- From the root folder of the repository
```
npm install
```

- Run a local development server instance
```
npm run dev
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

