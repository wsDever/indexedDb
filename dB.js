window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB ||window.msIndexedDB ;
window.IDBCursor = window.IDBCursor || window.webkitIDBCursor || window.msIDBCursor ;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction ;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange ;
	
var myDb = {
	name:"myFamily",
	version:1,
	db:null
}
var myStore = {
	name:"Fmember",
	keyPath:"name",
	index:"name"
}
//创建数据库  
//db:数据库名称
//dbVersion:数据库版本
//sName:数据表名称
//keyName：主健名称
//indexName：索引名称
function openDb(db,dbVersion,sName,keyName,indexName){
	var version = dbVersion || 1 ;
	var request = indexedDB.open(db,version);
	request.onerror = function(e){
		console.log("error");
	}
	request.onsuccess = function(e){
		console.log("success");
		myDb.db = e.target.result ;
	}
	request.onupgradeneeded = function(e){
		console.log("update version");
		var db = e.target.result ;
		if(!db.objectStoreNames.contains(sName)){
			var store = db.createObjectStore(sName,{"keyPath":keyName});
			// store.createIndex( indexName+"Index",indexName,{unique:true});
		}
	}
}
// 向数据库中的数据表添加数据
// db:数据库名称
// sName:数据表名称
// nData:添加的新数据
function addDataForDb(db,sName,nData){
	var tsaction = db.transaction(sName,"readwrite");
	var store = tsaction.objectStore(sName);
	for(var i=0;i<nData.length;i++) {
		store.add(nData[i]);
	}
}
// 从数据库中的数据表里删除数据
// db:数据库名称
// sName:数据表名称
// deleteAttr:要删除的数据属性
// itemName:删除的属性对应的值
function deleteData(db,sName,deleteAttr,itemName){
	var tsaction = db.transaction(sName,"readwrite");
	var store = tsaction.objectStore(sName);
	var requestCur = store.openCursor();
	requestCur.onsuccess = function(e){
		var cursor = e.target.result ;
		
		if(cursor){
			var curLine = cursor.value;
			if(curLine[deleteAttr] === itemName)
			{
				var del = cursor.delete();
				del.onsuccess = function(e){
					
				}
			}
			cursor.continue();
		}
	}	
}
// 从数据库中的数据表里更新数据
// db:数据库名称
// sName:数据表名称
// dpAttr:更新的属性
// dpItemName:属性对应的值
// newData：属性对应的新值
function updateData(db,sName,dpAttr,dpItemName,newData){
	var tsaction = db.transaction(sName,"readwrite");
	var store = tsaction.objectStore(sName);
	var requestCur = store.openCursor();
	requestCur.onsuccess = function(e){
		var cursor = e.target.result ;		
		if(cursor){
			var curLine = cursor.value;
			if(curLine[dpAttr] === dpItemName)
			{
				for(var o in newData)
				{
					curLine[o] = newData[o];
				}
				var update = cursor.update(curLine);
				update.onsuccess = function(e){
					alert("修改成功")
				}
				update.onerror = function(e){
					alert(e.value)
				}
			}
			cursor.continue();
		}
	}	
}
