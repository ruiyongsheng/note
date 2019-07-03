## 一. Mac使用终端安装Homebrew(brew)

Homebrew简称brew,OSX上的软件包管理工具，在Mac终端可以通过brew安装、更新、卸载软件。
1. 赋予管理员权限
```
sudo chmod -R g+w /usr/local
````
2. 安装homebrew
````
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
````
3. 更新完成后的提示如下图所示：
 ![](https://user-gold-cdn.xitu.io/2018/5/16/1636902dc058d996?w=1048&h=160&f=jpeg&s=92741)

4. 常用的三条语句搜索(search)、更新(install)、卸载(remove)

        搜索：brew search SoftwareName
        
        更新：brew install SoftwareName
        
        卸载：brew remove SoftwareName
        
        （SoftwareName 是你需要处理的软件名）                    

5. 接下来就可以通过brew安装你需要的文件了，比如安装git

        brew install git

## 二. Mac下安装终端利器 iterm2;

这里直接贴链接，文章介绍的很详细了，尊重原创，请移步这里

[Mac下的终端利器iTerm2](https://www.cnblogs.com/xishuai/p/mac-iterm2.html) ;

## 三. Mac os下如何升级ruby版本   

    表问辣么多，后期你会明白（因为Macos自带ruby版本太旧，导致你安装的自动化部署踩坑）；
    
    首先你要明白，rvm是什么？为什么要安装rvm呢，因为rvm可以让你拥有多个版本的Ruby，并且可以在多个版本之间自由切换。
第一步：安装rvm

    curl -L get.rvm.io | bash -s stable
然后

    source ~/.rvm/scripts/rvm
等待终端加载完毕,后输入：

    rvm -v
如果能显示版本好则安装成功了。

第二步：安装ruby

列出ruby可安装的版本信息

    rvm list known
安装一个ruby版本

    rvm install 2.3.1
如果想设置为默认版本，可以用这条命令来完成

    rvm use 2.3.1 --default 
查看已安装的ruby

    rvm list
卸载一个已安装ruby版本

    rvm remove 2.0.0
第三步：更换源

查看已有的源

    gem source
显示会如下：

    CURRENT SOURCES
    http://rubygems.org/
如上已经安装成功。但因为国内网络的问题导致gem源间歇性中断因此我们需要更换gem源。（使用淘宝的gem源https://ruby.taobao.org/）如下：

    //1.删除原gem源
    gem sources --remove https://rubygems.org/
    
    //2.添加国内淘宝源
    gem sources -a https://ruby.taobao.org/
    
    //3.打印是否替换成功
    gem sources -l
    
    //4.更换成功后打印如下
    *** CURRENT SOURCES ***
    https://ruby.taobao.org/



参考文章：
1. [Mac下安装Homebrew](https://blog.csdn.net/boyqicheng/article/details/71481213?utm_source=itdadao&utm_medium=referral) ；
2. [Mac下的终端利器iTerm2](https://www.cnblogs.com/xishuai/p/mac-iterm2.html) ;
3. [如何在Mac 终端升级ruby版本](https://blog.csdn.net/sharpyl/article/details/52786676);
4. [安装sass,替换ruby镜像源](https://www.sass.hk/install/);