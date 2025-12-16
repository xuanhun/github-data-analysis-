# Disclaimer

> **Important Notice:** This application is based on [star-history/star-history](https://github.com/star-history/star-history) and has been modified and upgraded. We will continue to add more data analysis features. We express our sincere gratitude to the original authors! This document has also been modified and improved based on the original repository's documentation.

---

# Add a live star-history chart to your GitHub README

<img width="1974" height="1580" alt="image" src="https://github.com/user-attachments/assets/412dc876-731f-4ac7-8320-7a4a25b38633" />

Now we support embedding a live star history chart into your GitHub README.  Above is the screenshot from our own [GitHub data analysis](https://github.com/xuanhun/github-data-analysis-).

This feature is quite handy.  A snippet would appear after querying the repository from our star-history.com main page; the only thing you need to do is simply copy that snippet into your GitHub README markdown file.
<img width="1302" height="903" alt="image" src="https://github.com/user-attachments/assets/74ae1e8b-98c7-4811-a16d-cdf959f820e2" />

Under the hood, it's actually a long story about developing this embedded star history chart.  It all starts from an issue 6 years ago.



## Embed with `<iframe />`

After looking through the popular web-side embedding implementations, we decide to use `<iframe />` as the embedded block container.  It can display original charts on a webpage without implementing a backend server.  And `<iframe />` is also interactive with real-time data.

Because GitHub API imposes a strict rate limit on the anonymous callers, we need users to provide their self-generated tokens to overcome that limit.

### Step-to-step guide to use `iframe` embed

1. Open [gitdata.xuanhun520.com](https://gitdata.xuanhun520.com/) and query for a repository;

2. Click the `Embed` button below the chart;

3. Input your personal access token;
  <img width="745" height="596" alt="image" src="https://github.com/user-attachments/assets/945002e1-3661-452e-82b7-e720e0dda80d" />


4. Click the `Copy` button, then paste it into your websites or blogs;

## Live chart image in SVG format

The iframe-based embed block is a decent improvement, while it still has some flaws:

1. One commonly used case is to embed the GitHub star-history chart into the repository README file, so that it can be displayed on the repo's front page. However, the GitHub markdown flavor disallows rendering `<iframe />`, which makes it impossible to directly embed star-history charts there.
2. We require users to provide their personal access tokens.  Though star-history never stores the token on our own server (we don't have a server at all), the token itself could be found if someone views the webpage source code.  This limits the usage since it's not fully secure unless adding the chart to a trusted platform, i.e. the internal dashboard of a team.



### Step-to-step guide to add the chart to your GitHub README

1. Open [gitdata.xuanhun520.com](https://gitdata.xuanhun520.com) and query for a repository;

2. Scroll the page below the action buttons;
   <img width="1513" height="610" alt="image" src="https://github.com/user-attachments/assets/22dde4e3-1720-4083-af59-e53309dcd393" />

3. Click the `Copy` button;

4. Paste the code into your repository's README;

5. Everything is done. 😎


## Conclusion

We provide two ways to embed the real-time star history chart into the web pages.

- If you want to put an auto-sizeable and interactive chart on your private network, you should try the embedded chart with `<iframe />`.
- If you want to show a static chart with update-to-date star history data to the public, such as putting it on the GitHub repository README, you should use the image link such as `https://gitdata.xuanhun520.com/api/starimg?repos=viactor/vchart&type=Date&theme=dark`

---


## Future Plans

- Add more editing and annotation features
- View and edit VChart code, export to VChart official editor
- Generate star history animated videos (GIF)
- More GitHub data statistics and analysis features