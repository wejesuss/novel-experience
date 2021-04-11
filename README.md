<h2 align="center">Read Helper</h2>

---

<h3 align="center">
  <a href="#information_source-about">About</a>&nbsp;|&nbsp;
  <a href="#interrobang-reason">Reason</a>&nbsp;|&nbsp;
  <a href="#seedling-requirements">Requirements</a>&nbsp;|&nbsp;
  <a href="#grey_question-getting-started">Getting Started</a>&nbsp;|&nbsp;
  <a href="#rocket-used-technologies">Technologies</a>&nbsp;|&nbsp;
  <a href="#link-how-to-contribute">Contribute</a>&nbsp;
</h3>

---

## :information_source: About

This extension lets you read with your reading speed in mind and gives you a couple of shortcuts and mod cons to help you in your reading session.

## :interrobang: Reason

The key reason was to help me in my reading (especially in web novels), so the core of the application is to help the user with scroll, as time passed however I decided to add more features.

## :seedling: Requirements

You just need a browser that supports chrome extensions ([Chrome Extensions API]).

## :grey_question: Getting Started

To use this you need to:

- Load the unpacked version on your browser

<br/>

To load the unpacked version

1. Download this repository (unzip it if needed)

2. Go to the extensions page of your browser (probably **chrome://extensions**)

3. Enable the 'Developer mode':

<p align="center">
    <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/extensions_SqBs3POHx.png"  alt="developer mode example"/>
    Make sure to select that option
</p>

4. Now click the 'load unpacked' button that has appeared on the top left and choose the folder of this project:

<p align="center">
    <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/load-unpacked_nCn9iByR3.png"  alt="developer mode example"/>
</p>

5. You are done, enjoy 😀

<br/>

### The Core Features

#### **Auto-Scroll**

**Press** `K` to start the scroll

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/k-shortcut_RDIhZxM5g.gif" alt="auto-scroll with K shortcut" width="100%">
</p>

Too slow?

**The more you press** `K` the faster it scrolls

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/k-too-slow-shortcut_PsHVJB0b1.gif" alt="faster auto-scroll with K shortcut" width="100%">
</p>

Want a break?

**Press** `S` to stop scrolling

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/s-shortcut_YpDMIqyy1.gif" alt="stop auto-scroll with S shortcut" width="100%">
</p>

<br/>

Are you looking for a specific part of the page?

You can **press** 0-9 to go the nth \* 10 percent of that page

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/percentage-scroll-shortcut_goKk55Le51.gif" alt="percentage scroll with 0-9 shortcut" width="100%">
</p>

---

<br/>

#### **Domain Preferences**

You can also control where and when the extension will run using URL and Domain preferences

For example, you can block the extension at a specific URL using the menu and no more scroll for that\*

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/block-url_Rr0jKS_7wg.gif" alt="block url" width="100%">
</p>

Maybe you prefer to block an entire domain (hostname)

<p align="center">
  <img src="https://ik.imagekit.io/vhx2sevqtq/reader-helper/block-domain_5se8biLL5.gif" alt="block domain" width="100%">
</p>

\* <small>All shortcuts are disabled</small>

---

### **Specific Features**

There is one more keyboard shortcut, the arrow key which allows the user to change the chapter in specific websites (like [`wuxiaworld`](https://www.wuxiaworld.com/) and [`novelmania`](https://novelmania.com.br/))

For example, you can press `Left Arrow` at [this page](https://www.wuxiaworld.com/novel/against-the-gods/atg-chapter-702) and you will be redirected to the previous chapter, the same goes for `Right Arrow` for the next chapter.

## :rocket: Used Technologies

This project was created with the following technologies

- [Chrome Extensions API]

## :link: How to Contribute

- `Fork` this repository and `Clone` it
- Create a new `branch` for your modification
- `Commit` your changes
- `Push` your `branch` to your repository
- Make a `Pull Request` in this repository

[chrome extensions api]: (https://developer.chrome.com/docs/extensions/reference/)
