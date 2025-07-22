# cloudemoticon-rs

[![build](https://github.com/TransparentLC/cloudemoticon-rs/actions/workflows/build.yml/badge.svg)](https://github.com/TransparentLC/cloudemoticon-rs/actions/workflows/build.yml)
[![download](https://img.shields.io/github/downloads/TransparentLC/cloudemoticon-rs/total.svg)](https://github.com/TransparentLC/cloudemoticon-rs/releases)

[“云颜文字”](https://emoticon.moe/)非官方桌面客户端。

本项目也是我自己在 2018 年左右编写的旧版[相同项目](https://github.com/TransparentLC/CloudEmoticon)的重制版。

本项目使用 Rust+Tauri+Vue 编写，与官方桌面客户端相比，体积更小（小于 2 MB！），界面更美观，同时仍然保留了旧版的快速输入的特色功能～

*官方客户端使用 Electron 编写，只能复制颜文字，需要手动粘贴才能完成输入。*

除了颜文字，你当然也可以用它来输入一些别的东西。

![](https://p.sda1.dev/25/99775aa7395f5dde287217ec1ac73cc3/S85O.webp)

> [!NOTE]
>
> 如果你是 Linux 用户并且使用 KDE 桌面，为了正常使用快速输入，你可能需要在“窗口行为”中关闭“阻止焦点抢占”。参考：[Cannot have focus on Ubuntu GNOME · Issue #6310 · tauri-apps/tauri](https://github.com/tauri-apps/tauri/issues/6310#issuecomment-1518694428)

## 使用演示

https://github.com/user-attachments/assets/99f0873d-a371-49d6-92a7-976340f44b9b

## 订阅源

### 官方源

以下是“云颜文字”项目官方提供的[订阅源](https://github.com/cloud-emoticon/store-repos)，你可以复制链接后通过“设置”的“添加在线源”导入。

| 订阅源名称            | 作者                                              | 链接                                                                                                                                                                                                                |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A 岛颜文字汇集        | [陈少举](https://twitter.com/chenshaoju)          | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/a-land.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/a-land.meta.json)                       |
| japaneseemoticons.net | [wicast chen](https://twitter.com/wicastchen)     | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/japaneseemoticons.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/japaneseemoticons.meta.json) |
| 颜文字屋              | [wicast chen](https://twitter.com/wicastchen)     | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/kaomojiya.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/kaomojiya.meta.json)                 |
| CIA                   | [KTachibanaM](https://twitter.com/KTachibana_M)   | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/kt-cia.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/kt-cia.meta.json)                       |
| KT's favourites       | [KTachibanaM](https://twitter.com/KTachibana_M)   | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/kt-favorites.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/kt-favorites.meta.json)           |
| Midori                | [Midori Yakumo](https://twitter.com/MidoriYakumo) | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/midori.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/midori.meta.json)                       |
| Oliver Wang           | [Oliver Wang](https://twitter.com/Toohashi)       | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/oliver-wang.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/oliver-wang.meta.json)             |
| Yashi-poi             | [神楽坂雅詩](https://twitter.com/kagurazakayashi) | [GitHub](https://raw.githubusercontent.com/cloud-emoticon/store-repos/refs/heads/master/yashi-poi.meta.json) [jsDelivr](https://cdn.jsdelivr.net/gh/cloud-emoticon/store-repos/yashi-poi.meta.json)                 |

### 编写和分享自己的源

你可以使用内置的编辑器来编写自己的源。

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://p.sda1.dev/25/3236f95d234a7df19db750ff96eb2092/3GgJ.webp">
    <source media="(prefers-color-scheme: light)" srcset="https://p.sda1.dev/25/916970e0d49ab9c91e61acbad687a226/l90l.webp">
    <img src="https://p.sda1.dev/25/916970e0d49ab9c91e61acbad687a226/l90l.webp">
</picture>

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://p.sda1.dev/25/1dea5d0e9e42afc2987c59546ab41b0b/EFNr.webp">
    <source media="(prefers-color-scheme: light)" srcset="https://p.sda1.dev/25/961418be9fc4bee67b9cd5e254e12053/VmL1.webp">
    <img src="https://p.sda1.dev/25/961418be9fc4bee67b9cd5e254e12053/VmL1.webp">
</picture>

一个源包含两个文件：

* 用于描述订阅源基本信息的元数据 `*.meta.json`
* 具体的颜文字信息 `*.json`

这两个文件名称相同，一般来说需要放在同一目录下。之后你就可以通过“设置”的“添加本地源”导入了。导入以及编辑器中打开和保存的都是元数据文件。

如果你想将你编写的源分享给其他人，可以同时发送这两个文件然后使用“添加本地源”导入，也可以将它们放在你的服务器上，然后将元数据文件 `*.meta.json` 的 URL 使用“添加在线源”导入。

你也可以直接编辑这两个 JSON 文件，具体的数据格式可以参见官方提供的 [TypeScript 定义](https://github.com/cloud-emoticon/store-repos/tree/master/linter/src/api)，也可以查看上面的官方源作为示例。

<details>

<summary>其他的注意事项</summary>

“云颜文字”项目早期使用 XML 格式存储颜文字信息（在元数据中 `type` 字段为 `localXml`），目前已经废弃。本项目出于兼容考虑仍然支持读取这一格式，但不支持保存。

如果不想将元数据和颜文字信息放在同一目录，可以将元数据的 `type` 字段设为 `remoteJson` 并通过 `remoteUrl` 写上后者的实际 URL。

</details>

## 开发

需要安装 **Nightly Rust** 和最新版本的 Node.js。

*Stable Rust 应该也能编译，但是我用了一些 Nightly Rust 才能使用的编译优化……*

本项目还使用了以下工具：

* 使用 [Biome](https://biomejs.dev/) 对前端代码进行格式化和 lint
* 使用 [commitlint](https://commitlint.js.org/) 保证 commit message 符合 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范
* 使用 [Lefthook](https://lefthook.dev/) 管理 Git Hooks

安装前端依赖（这里使用 [pnpm](https://pnpm.io/) 作为包管理器）：

```sh
pnpm install
```

配置一下 Git Hooks：

```sh
pnpm exec lefthook install
```

开发：

```sh
pnpm tauri-dev
```

编译 release 版：

```sh
pnpm tauri-release
```

用 [UPX](https://upx.github.io/) 压一压：

```sh
# Windows
upx --ultra-brute src-tauri/target/release/cloudemoticon-rs.exe
# Linux
upx --ultra-brute src-tauri/target/release/cloudemoticon-rs
```

通过 GitHub Actions 制作的 deb 包继续制作 Arch 包：

<details>

安装 `devtools`。

在一个空目录中写入以下的 `PKGBUILD`，替换版本号和 release 中 deb 包的 SHA256：

```sh
# Maintainer: TransparentLC <me@akarin.dev>

pkgname=cloudemoticon-rs
pkgver=0.0.0
pkgrel=1
pkgdesc="A cloud solution to your favorite emoticons."
arch=('x86_64')
url="https://github.com/TransparentLC/cloudemoticon-rs"
license=('AGPL-3.0-or-later')
depends=('cairo' 'desktop-file-utils' 'gdk-pixbuf2' 'glib2' 'gtk3' 'hicolor-icon-theme' 'libsoup' 'pango' 'webkit2gtk')
options=('!strip' '!emptydirs')
source_x86_64=("${pkgname}_${pkgver}_amd64.deb::${url}/releases/download/v${pkgver}/${pkgname}_${pkgver}_amd64.deb")
sha256sums_x86_64=("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

package() {
  tar -xf data.tar.xz -C "${pkgdir}"
}
```

然后在这个目录下运行 `extra-x86_64-build` 打包，得到 `cloudemoticon-rs-0.0.0-1-x86_64.pkg.tar.zst`。

</details>

### TODO

* [x] 显示和添加官方源的界面
* [x] Linux 版
* [ ] ~~macOS 版~~
    * 虽然整个技术栈都是跨平台的，但是我没有 macOS 设备，对 macOS 也不熟，所以没办法编写和测试
    * 当然你还是可以尝试让它能在 macOS 上跑起来，大概是可行的
