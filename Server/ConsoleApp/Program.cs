using DataAccess.Model;
using DataAccess.BLL;
using System.IO;
namespace ConsoleApp
{
    internal class Program
    {
        static void Main(string[] args)
        {
            ChangeMP3FileName();
            Console.ReadLine();
        }

        static void ChangeMP3FileName() 
        {
            string message = string.Empty;
            string Mp3FilePath = "D:\\PublishProject\\YamMusicPlayer\\wwwroot\\Files\\SondFiles";
            List<songinfo> list = new songinfo_BLL().Query("",out message);
            for(var i=0;i<list.Count;i++) 
            {
                songinfo info = list[i];
                string newFileName = $"{info.songId.GetValueOrDefault().ToString()}.mp3";
                string oldFileFullName = $@"{Mp3FilePath}\{info.fileName}";
                string newFileFullName = $@"{Mp3FilePath}\{newFileName}";
                Console.WriteLine($@"oldFileFullName={oldFileFullName}");
                Console.WriteLine($@"newFileFullName={newFileFullName}");
                info.fileName = newFileName;
                try
                {
                    if (File.Exists(oldFileFullName) && !File.Exists(newFileFullName))
                    {
                        File.Move(oldFileFullName, newFileFullName);
                        int state = new songinfo_BLL().Update(new List<songinfo>() { info }, $" songId='{info.songId.GetValueOrDefault().ToString()}' ", out message);
                        if (state == 0)
                            Console.WriteLine($"文件[{oldFileFullName}],重命名[{newFileName}]成功");
                        else
                            Console.WriteLine($"文件[{oldFileFullName}],重命名[{newFileName}]更新失败,[{message}]");
                    }
                    else 
                    {
                        if (File.Exists(newFileFullName)) 
                        {
                            int state = new songinfo_BLL().Update(new List<songinfo>() { info }, $" songId='{info.songId.GetValueOrDefault().ToString()}' ", out message);
                            if (state == 0)
                                Console.WriteLine($"文件[{oldFileFullName}],重命名[{newFileName}]成功");
                            else
                                Console.WriteLine($"文件[{oldFileFullName}],重命名[{newFileName}]更新失败,[{message}]");
                        }
                        Console.WriteLine($"旧文件[{oldFileFullName}]不存在,或者新文件[{newFileFullName}]已存在");
                    }
                }
                catch(Exception exp) 
                {
                    Console.WriteLine($"文件[{oldFileFullName}],重命名[{newFileName}]更新失败,[{exp.Message}]");
                }
            }
        }
    }
}