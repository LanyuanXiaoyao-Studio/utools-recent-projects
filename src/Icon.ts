// 编译时通过脚本生成到 dist 文件夹中, 这个空文件只是为了 typescript 编译不出错和其他文件的引用
// 避免每次提交代码的时候因为这个额外的生成文件导致合并冲突
export const iconMap: { [key: string]: string } = {}
