/*
 * @Author: yarkone 
 * @Date: 2018-11-05 10:22:51 
 * @Last Modified by: yarkone
 * @Last Modified time: 2019-02-25 19:37:38
 */
import Vue from 'vue'

export const tool = {
	/**
	 * 获取电子签约需要的总信息
	 */
	getTotalInfo: () => {
		let totalInfo;
		try {
			totalInfo = JSON.parse(localStorage.getItem('totalInfo'));
		} catch (e) {
			totalInfo = null;
		}
		return totalInfo;
	},
	/**
	 * 获取地址
	 */
	getImgSrc: (src) => {
		console.log(Vue.$getApi)
		return Vue.$getApi(src, 'img');
	},
	/**
	 * 剔除当前完成的任务，并存入localStorage
	 * targetAuth  {string}  要剔除的任务名称
	 */
	resetTotalInfo: (targetAuth) => {
		let totalInfo;
		try {
			totalInfo = JSON.parse(localStorage.getItem('totalInfo'));
		} catch (e) {
			totalInfo = null;
		}
		let authTypes = totalInfo.authTypes || '';
		if(authTypes) {
			let arr = authTypes.split(',');
			arr.splice(arr.indexOf(targetAuth), 1);
			totalInfo.authTypes = arr.join(',');
		}
		localStorage.setItem('totalInfo', JSON.stringify(totalInfo));
	},
	/**
	 * 任务跳转
	 */
	getNextAuthTypes: () => {
		let totalInfo;
		try {
			totalInfo = JSON.parse(localStorage.getItem('totalInfo'));
		} catch (e) {
			totalInfo = null;
		}
		let authTypes = totalInfo.authTypes || '';
		let configMap = {
			bankCardAuth: {
				path: 'bankCardAuth',
				title: '银行卡认证'
			},
			mobileAuth: {
				path: 'mobileAuth',
				title: '短信认证'
			},
			bodyAuth: {
				path: 'bodyAuth',
				title: '活体检测'
			},
			faceContrastAuth: {
				path: 'faceContrastAuth',
				title: '人脸对比'
			}
		};
		if(!authTypes) {
			return 'contract';
		} else {
			let arr = authTypes.split(',');
			if(!arr.length) return;
			if(arr[0] && configMap[arr[0]]) {
				return configMap[arr[0]].path;
			} else {
				return '';
			}
		}
	},
    /**
	 * 添加日期格式化方法
	 * @params {number} time 时间戳
	 * @params {boolean} isTime 是否输出时分秒
	 */
	formatDate: (time, isTime) => {
		if(!time) return '';
		if(!time) return undefined;
		var cDate = new Date(parseInt(time)),
			_year = cDate.getFullYear(),
			_month = tool.leftPad(cDate.getMonth() + 1, 2),
			_date = tool.leftPad(cDate.getDate(), 2),
			_hours = tool.leftPad(cDate.getHours(), 2),
			_minutes = tool.leftPad(cDate.getMinutes(), 2);
		if(isTime) {
			return _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
		}
		return _year + '-' + _month + '-' + _date;
	},
	leftPad: (s, n) => {
		var l = '';
		s = s + '';
		if(s.length < n) {
			for(var i = 0, len = n - s.length; i < len; i++) {
				l += "0";
			}
			return l + s;
		}
		return s;
    },
    /**
	 * 添加判断是否为空对象的方法
	 */
	isEmptyObject: (e) => {
	    var t;
	    for (t in e)
	        return !1;
	    return !0
    },
    /**
     * 滚动条滚动到number位置
     */
    scrollTop: (number) => {
        document.body.scrollTop = number;
        document.documentElement.scrollTop = number;
    },
    /**
     * 流程环节的跳转传参
     * @param  {array} tasks 当前的任务数组
	 * @param  {string} opts  跳转附带的额外参数 opts.newWindow 代表是否打开新窗口
	 * @param  {string} code  银行code
     */
    redirect: (tasks, opts) => {
        let loanTasks = tasks;
		let taskObj = [],
            _path = 'loanProcess', 
            query = {
                targetArr: undefined, 
                selected: undefined,
                category: undefined,
                taskId: undefined,
                orderNo: undefined
            };
		for(let i = 0, len = loanTasks.length; i < len; i++) {
			let obj = loanTasks[i];
			taskObj.push({
				category: obj.category,
				id: obj.id,
				taskName: obj.taskName,
				submited: obj.submited
            });
            if(!loanTasks[i].submited && !query.targetArr) {
				query.targetArr = taskObj;
				query.taskId = obj.id;
				query.selected = i;
				query.category = obj.category;
				query.orderNo = obj.orderNo;
			}
        }
            
        return { query, opts };
    }
}
