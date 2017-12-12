//包装函数
module.exports = function(grunt){
	//任务配置，所有插件的配置信息
	grunt.initConfig({
		//获取package.json的信息
		pkg:grunt.file.readJSON('package.json'),
		
		//uglify插件压缩js代码文件的配置信息
		uglify:{
			options:{
				banner:'/*!<%=pkg.name%>-<%=pkg.version%>.js <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build:{
				files:[{
					expand:true,
					cwd:'src/js',
					src:'*.js',
					dest:'js'
				}]
			}
		},
		
		//cssmin插件要压缩css代码语法的配置信息
		cssmin:{
			options:{
				banner:'/*!<%=pkg.name%>-<%=pkg.version%>.css <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build:{
				files:[{
					expand:true,
					cwd:'src/css',
					src:'*.css',
					dest:'css'
				}]
			}
		},

		//less插件编译css代码
		less:{
			build:{
				files:[{
					expand:true,
					cwd:'less',
					src:'*.less',
					dest:'src/css',
					ext: '.css'
				}]
			}
		},

		//watch插件的配置信息
		watch:{
			build:{
				files:['src/js/*.js','src/css/*.css','less/*.less'],
				tasks:['uglify','cssmin','less'],
				options:{spawn:false}
			}
		}
	});
	
	//告诉grunt我们将使用插件
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	
	//告诉grunt当我们在终端输入grunt时需要做些什么（注意先后顺序）
	grunt.registerTask('default',['less','uglify','cssmin','watch']);
}