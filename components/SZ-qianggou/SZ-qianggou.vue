<template>
	<scroll-view class="swiper-tab" scroll-x :scroll-left="scrollLeft" :scroll-with-animation="true">
		<view v-for="(item, index) in qgItems"
			:key="item.index"
			:class="['swiper-tab-list',index == tabIndex ? 'qg_active' : '']"
			:id="index"
			@click="gettqg(index)"
			>
			<view class="list-item" >
				<text class="time">{{item.name}}</text>
				<text >{{item.title}}</text>
				<text v-if="index == tabIndex" class="qgactive-item"></text>
				<!-- <text v-if="item.hs <= gettime && gettime <= item.he" class="qgactive-item"></text> -->
			</view>
		</view>


	</scroll-view>
</template>

<script>
	const utils = require('../../common/utils')

	export default {

		data() {
			return {
				tabIndex: 0,	//选中项下标
				scrollLeft:0,	//滚动位置
				qgItems:[{
					time:'8:00',
					hs:0,
					he:7,
					clickable:1
				}
				]
			}
		},
		computed: {
			gettime(){
				// 计算时间
				let state = '已开抢'
				let nowTime = new Date();
				// let h =nowTime.getHours();
				let h =nowTime.getTime();
                console.log(h)
				return h;
			}
		},
		mounted(){
			console.log(this.gettime)

		},
		methods: {
			gettqg(index) {
				var that = this
				if (that.tabIndex !== index) {
					that.tabIndex = index;
					// this.scrollLeft = index*50;
					that.scrollLeft = (index -2)*75;
					that.$emit('clickItem', that.qgItems[index],that.qgItems[index].clickable);
				}
			},
			initList(list){
				var that = this
                that.qgItems = []
				if (utils.isNotNull(list)&&list.length>0) {
					for (let i = 0; i < list.length; i++) {
						var info = list[i]
						// info.hs = new Date(info.startTime).getHours()
						// info.he = new Date(info.endTime).getHours()
						info.hs = info.startTime
						info.he = info.endTime
						console.log(info.hs + '---' + info.he + '---当前时间:'+ that.gettime)
						if (info.hs <= that.gettime && that.gettime <= info.he){
							info.title = '抢购进行中'
							info.clickable = 1
						}else if (that.gettime < info.hs){
							info.title = '即将开抢'
							info.clickable = 0
						}else if (that.gettime >= info.he){
							info.title = '已开抢'
							info.clickable = 1
						}
						that.qgItems.push(info)
					}
					that.jisuan()
				}
			},
            // 计算位置
            jisuan(){
				var isClickItem = false
                for(let i in this.qgItems){
                    if (this.qgItems[i].hs <= this.gettime){
                        this.tabIndex = i;
                        this.scrollLeft = (i -2)*75;
                    }
                    var info = this.qgItems[i]
                    if (info.hs <= this.gettime && this.gettime <= info.he) {
						isClickItem = true
						this.$emit('clickItem', info,info.clickable);
					}
                }
                if (!isClickItem) {
					this.$emit('clickItem', this.qgItems[this.qgItems.length-1],this.qgItems[this.qgItems.length-1].clickable);
				}
            }

		},
	}
</script>

<style scoped>
	.list {
		width: 750upx;
		height: 100%;
	}
	.swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
	}
	.swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 64upx;
		/* height: 116upx; */
		height: 100upx;
		border:0;
		font-size:24upx;
		position: fixed;
		/* top: calc(var(--status-bar-height) + 44px); */
		z-index: 1000;
		background: #37c8a9;
		/*margin-top: calc(var(--status-bar-height) + 44px);*/
	}
	.swiper-tab-list {
		font-size: 30upx;
		/*width: 150upx;*/
		padding: 10upx 5upx;
		display: inline-block;
		text-align: center;
		color: #000;
		background: transparent;
		line-height:20px;
	}
	.list-item{
		display:flex;
		flex-direction: column;
		align-items: center;
		font-size: 24upx;
	}
	.list-item .time {
		font-size: 36upx;
	}
	.qg_active {
		color: #fff;
		/* background:#FF502E; */
	}
	.qgactive-item{
		width: 0;
		height: 0;
		border-width: 5px;
		border-style: solid;
		border-color: #FF502E transparent transparent transparent;
		position:absolute;
		margin-top:45px;
		display: none;
	}
</style>
