import {Component, Fragment, Img} from 'nano-jsx'
import {Context} from '../../context'
import Nano = require('nano-jsx')

export interface ApplicationSettingCardProps {}

export interface ApplicationSettingCardState {}

export class ApplicationSettingCard extends Component<ApplicationSettingCardProps, ApplicationSettingCardState> {
    private icon: string = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAmVBMVEUAAABceIhgfYtffYxgfYtffYtgfYtgfItgfYtffYxgfItgfItgfotgfotgfotgfYtgfYtgfYtgfYtgfoxgfYtgfYtgfYxgfYtEWmRgfYtgfYtFWmRFWWRgfYtEWmRFWWNgfYtEWmRFWmRFWmNFWmREWmVFWmRFWmRFWmRFWmRFWWRgfYtFWmRJYGtceIVYc4BOZnJRa3dVbnsdBSFyAAAAK3RSTlMADvll57nxOttNn3YsjIFEHMNZJK5tFtHyypdHFjLXtKaTMyR2YePLvoKcxDF7bgAABKlJREFUeNrs1+tyokAQBeDDyEVEEEHWaDQxiVYl6Rm8vP/D7dZuys0qNNNsjb/8HmCmge4zA+7u7u7uevGa4Ta8maJmfoxbGFErleMGhtRugBtQ1C6Dex4xlnBvTIwZ3IuIMYV7BTGGcK8ihoJ7GXE8ODciTgnnAuJEcG5BnBjO+cSp4JwiTgbXPKKbZHFRjZkklmfxYBlDwJsTUTBpWmhILLVpKNxLfGF7pPTbvMC/Ep+6BRcl5Gkova2U6pztlYezgU92RjnOxhvFfB6LrAnT/GulKVlTCf6Igj4hEV+stiwBZIokFiWAYsGclaJL32wSkFA4qK7XSWAjIVt1vf+lru2rytHtR2i19+lg9Jk5nOyq2AiOW0Z9NPqKOTI1CE7LNXXZG93C7KnLHF2mou3lJVTgFcQ76A6H+r/60POJc9LdzIlYI3Ayu8fnHYgV8YcAw2hLhg9JtJtxs2e0NVNTr1/oiWT//hX4HlrM2fcvYvrc2yrZ/v0rUGvxCB612FH8E50y8ad74EKxEP5xGN2DkV6eff4DyB2ZAkQXkVr3VFMLNUGTRIkSuH8mhzGarYeyF/D0st3tti9PwlcwLdEqte+Ah483fHn7eLDvApWBE/uWI/C5wjerT9tBGEbg5YFVBmxxYWeXBSMPnSrV3YKPuPJo0YZhgSZ8Lxru+b/bdn6DIIellJ+BdzR65+dAZbAXh9w18BWNXvW109/uG0PCZ4bwGS2euUGcQYTrwR1a7LgunEOi5HpwhRYrrgtDSERMAT/bNbvdxGEgCk9MnLD5Ify0CSwtLYsErYY0wPs/3K72oqWRfWwTu1KlfrdcMARnzvic2ZOWPXoNyIUKFHAgLQdUAGhByCTBZ9B8Cvmdqa8CXkjLCyqg9nUGNqRl4+0MFKCAJWlZggLEjY5wi5TIrEftrXFSAhrRljRsUSOS5EIdAy1YPmj60BJoASgAz0Xd0foRbPFEMptaH4CMrzhiOcRieOQr4oqsqGLjRLR/UPwBe/NEVDoMI9gX2uyox045nPf9IlmTgXTMfdRD+br3BqoHc+4TpwQphfXF6OnqIPx5sr0a4cHssXG6mx9e17so2q1fD0439DutLOZi2OUcCYHN3yChPeHTohApUGCPj6B1s2hyYNF5tgc4cV3NOHs2SKRzLt/6tYjUNl0hTD6pL680A01YR+fRpEvqW8KCzs/34/BuhMMKBy43rvo0DOj8/H7+hadxD449Tq4kIZ4Zchqe2IgFIaaCIZd2aGZVmvekMCebn4/TEszYnNsaQ8NBK5dzh+jYPTxekZkZW9CdT+DbHTJDLAmYt+5yPv3jfOne2I6MbPitGCAku5JkiUNujCVBpkQjwU6sFhTdx0AEEPf9FRa8RAMs+dEYi4D5VUwmtfsaEcvFx6Q5wyKAPbJ4En3eyEqsnn5F1zxmAogAkoRmTn3qCS5BvYG2+F+CKMie6DmWlfqTFbO71taT2V36JTutXFNoSkYICk6OxY6Cg8WqoeBUjJAUnMKgNsGphwxc4feKcwoPVIQ5hadhQEXhkQwoKDwZ7sThKXEnDk+OO3F40uCN0Dw160hS+hLSkZp5RD/88A35C2SN6arArlV4AAAAAElFTkSuQmCC`
    private context: Context

    constructor(props: ApplicationSettingCardProps) {
        super(props)
        this.context = Context.get()
    }

    switch(id: string, value: boolean) {
        Context.update(id, value)
        this.context = Context.get()
        this.update()
    }

    override render() {
        return (
            <Fragment>
                <div class="gap"/>
                <div
                    id="application-setting-card"
                    class="gap"
                />
                <div class="form-item application-setting-card card">
                    <div class="card-header">
                        <Img
                            class="icon"
                            src={this.icon}
                        />
                        <span class="title">插件设置</span>
                    </div>
                    <div class="card-body">
                        <form class="form-horizontal">
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">过滤不存在的文件</div>
                                    <div class="form-description">插件会如实显示历史记录内容, 如同软件本身一样, 但如果你希望插件替你将不存在的文件过滤掉, 那么可以考虑启用该选项</div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        {this.context.enableFilterNonExistsFiles
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableFilterNonExistsFilesId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableFilterNonExistsFilesId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div class="divider"/>
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">获取 favicon</div>
                                    <div class="form-description">启动该选项可以使用互联网提供的「api.clowntool.cn」来获取网站图标显示在结果里代替浏览器图标, 但该 API 较慢; 另由于需要将网址传到该 API, 隐私问题也最好考虑在内</div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        {this.context.enableGetFaviconFromNet
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableGetFaviconFromNetId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableGetFaviconFromNetId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div class="divider"/>
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">获取文件图标</div>
                                    <div class="form-description">启动该选项可以在文件型历史记录的结果里显示系统文件图标作为 Icon, 但这会影响一些性能, 在低性能的机器上不建议开启</div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        {this.context.enableGetFileIcon
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableGetFileIconId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableGetFileIconId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                            <div class="divider"/>
                            <div class="form-group">
                                <div class="col-10 col-mr-auto">
                                    <div class="form-label">直接输入路径 (重启插件生效)</div>
                                    <div class="form-description">启动该选项可直接在路径框中输入路径而非使用文件选择器, 特殊情况可能会带来方便, 但也容易因为人为输入失误导致插件运行错误. (重启插件指完全退出插件后再次打开设置)</div>
                                </div>
                                <div class="col-1 flex-column-center">
                                    <label class="form-switch">
                                        {this.context.enableEditPathInputDirectly
                                            ? <input
                                                type="checkbox"
                                                checked
                                                onchange={() => this.switch(Context.enableEditPathInputDirectlyId, false)}
                                            />
                                            :
                                            <input
                                                type="checkbox"
                                                onchange={() => this.switch(Context.enableEditPathInputDirectlyId, true)}
                                            />}
                                        <i class="form-icon"/>
                                    </label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Fragment>
        )
    }
}
