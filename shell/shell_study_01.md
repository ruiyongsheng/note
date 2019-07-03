 ## ssh-agent 的用法
 [ssh-agent 的用法](https://www.cnblogs.com/kex1n/p/5229493.html)；
 
 ## bash: ./startup.sh: Permission denied解决
 ```
 在Linux下执行 *.sh文件，结果弹出：-bash: ./startup.sh: Permission denied 的提示。
 这是因为用户没有权限，而导致无法执行。用命令chmod 修改一下bin目录下的.sh权限就可以了。

chmod u+x *.sh

这里的u 这里指文件所有者，+x 添加可执行权限，*.sh表示所有的sh文件
 ```
## shell脚本执行的四种方式
1. 工作目录执行   

    工作目录执行，指的是执行脚本时，先进入到脚本所在的目录，然后使用   **./脚本**方式执行；
    
2. 绝对路径执行

    绝对路径中执行，指的是直接从根目录/到脚本目录的绝对路径
    直接输入文件路径去执行，例如
    这里 `pwd` 指的是该命令执行结果，等同于 **/home/rys/Desktop**
    
3. sh执行    

    即 sh *.sh    脚本
  
4. shell环境执行

   shell环境执行，指的是在当前的shell环境中执行，可以使用 . 接脚本 或 source 接脚本


参考文章：

1. [shell脚本执行的四种方式](https://blog.csdn.net/magi1201/article/details/75194515)；

