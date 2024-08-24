<a name="top"></a>
<h1 style="font-weight:normal">
    <img src=images/readme/ChristmasTreeTitleIcon.png alt="AdventCalendar" width=35>
  &nbsp;Advent Calendar&nbsp;
  <a href="https://christmas2023.monsoonandrayadventcalendar.link/"><img src=https://img.shields.io/badge/AdventCalendar-try%20now-brightgreen.svg?colorA=087c08></a>
  <a href="https://github.com/rayk47/advent-calendar/releases"><img src=https://img.shields.io/github/release/rayk47/advent-calendar.svg?colorB=58839b></a>
  <a href="https://github.com/rayk47/advent-calendar/blob/main/LICENSE.md"><img src=https://img.shields.io/github/license/rayk47/advent-calendar.svg?colorB=ff0000></a>
</h1>

<p align="center">
  <img height="400px" alt="advent-calendar-demo-gif" src="https://github.com/rayk47/advent-calendar/blob/main/images/readme/AdventCalendarDemo.gif">
</p>

## Table of Contents
- [About](#🚀-about)
- [How to Setup and Deploy](#📝-how-to-setup-and-deploy)
- [Architecture & Technologies](#🏠-architecture--technologies)
- [Future Enhancements](#⏩-future-enhancements)
- [Feedback and Contributions](#🤝-feedback-and-contributions)

## 🚀 About
This project allows you to deploy your own [Advent Calendar](https://en.wikipedia.org/wiki/Advent_calendar) gift to a loved one for Christmas. The calendar provides the following:
- A personalized header to make your loved one feel special
- Personal calendar images. Pictures for each calendar entry are a great way to showcase all the memories you and a loved one have shared over the years
- Opening restrictions. You can restrict opening of advent days until the day has arrived. Insert any funny gifs or images you would like to tell the user no! :) 
- Insert a gift. Behind each calendar entry can be a surprise gift for your loved one. The gifts can vary in size, value and sentimental value. You can add custom titles, custom images and fun descriptions.

### Why did I build this
Christmas is a beautiful time dedicated to spending time with family and loved ones. In todays day and age where anything can be purchased at the click of a button, getting a gift that shows you care about someone has become difficult. My partner is artistic and would regularly create art for me, I on the other hand struggle to draw a stickman. So I decided to put my coding skills to the test and make something that would make her feel special and show how much she meant to me. Each day on the lead up to christmas became an exciting countdown to open her next gift.

## 📝 How to Setup and Deploy
To setup and run your own advent calendar it is expected that you have some coding skills, ideally with javascript and that you have used AWS services before. 

<details>

<summary>Setup</summary>

#### 1. Install Node
See the following [Guide](https://nodejs.org/en/download/package-manager) to download and install

#### 2. Install the project
Run the following command
```
npm install
```

#### 3. Setup your Domain and Hosted zone in AWS
Use the following AWS [Guide](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/domain-register.html) to register your own domain and create a hosted zone for that domain. Be aware that this step will require you to purchase a domain. If you already have a domain you can just reuse that one.

####  4. Create your .env file
To deploy you need to populate some environment variables. This repo contains a [template .env](./.env.template) that you can use to get you started.

First run 
```
cp .env.template .env
```

After that open the .env file and populate your custom properties 

#### 5. Log into your AWS Account
Before you can deploy the Advent Calendar you must be logged into the AWS account on your terminal. There are many different ways to login to your account via terminal. I recommend that you setup an AWS IAM user and that you login via an [Access Portal](https://docs.aws.amazon.com/singlesignon/latest/userguide/using-the-portal.html)

#### 6. You should now be ready to deploy
Run the following command

```
npm run deploy
```
Once the deploy is complete you can navigate to URL you defined via the SUBDOMAIN.DOMAIN properties in your .env file. 

#### 7. Destroy
If you ever want to destroy the calendar you can run 

```
npm run destroy
```

</details>

## 🏠 Architecture & Technologies
This project uses the following technologies 
- Cloudfront
- AWS Lambda
- S3
- Cognito
- API Gateway
- React & Vite

As new features are added I intend to continue the trend of a serverless approach and will continue to make use of Lambda and other serverless services such as DynamoDB.


## ⏩ Future Enhancements
- Restrict access to calendars and images by auth
- Allow new users to sign up and create their own calendars instead of having to deploy
- Christmas gift opening animation https://www.youtube.com/watch?v=EudYjHN7StE
- Add technologies used https://github.com/tandpfun/skill-icons/blob/main/readme.md

## 🤝 Feedback and Contributions
If you would like to contribute feel free to create a PR or create an issue in the repository and I will try to help in any way I can. 


[Back to top](#top)
