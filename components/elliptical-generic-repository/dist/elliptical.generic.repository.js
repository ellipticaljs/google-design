/// a javascript generic repository for the elliptical service
/*
 * =============================================================
 * elliptical.GenericRepository
 * =============================================================
 *
 */

//umd pattern


(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        //commonjs
        module.exports = factory(require('elliptical-lodash').c);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['elliptical-lodash'], factory);
    } else {
        // Browser globals (root is window)
        root.elliptical = root.elliptical || {};
        root.elliptical.GenericRepository=factory(root._.c);
        root.returnExports = root.elliptical.GenericRepository;
    }
}(this, function (_) {

    if(_.c !==undefined) _=_.c;
    function _getStartEndParams(page,pageSize,count){
        var start = (page-1)*pageSize;
        var end=(page)*pageSize-1;
        if (end > count){
            end=count;
        }
        return{
            start:start,
            end:end
        };
    }

    function _guid(){
        var S4 = function S4() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }

    function _lowerCaseString(s){
        return s.charAt(0).toLowerCase() + s.slice(1);
    }

    function _trimLastChar(s){
        return s.substring(0,s.length-1);
    }

    function _camelCaseIterator(strArr){
        var s=strArr[0];
        var arr=s.split('.');
        var newArr=[];
        arr.forEach(function(e){
            e=_lowerCaseString(e);
            newArr.push(e);
        });
        var field='';
        newArr.forEach(function(e){
            field+=e + '.';
        });

        field= _trimLastChar(field);
        return [field];
    }

    function _getDataPage(data,params){
        return _.filter(data,function(obj,index){
            return (index>=params.start && index <=params.end);
        });
    }


    function _get(model,id){
        return _.find(model,function(obj){
            return obj.id.toString().toLowerCase()===id.toString().toLowerCase();
        });
    }

    function _getIndex(model,id){
        return _.findIndex(model,function(obj){
            return obj.id.toString().toLowerCase()===id.toString().toLowerCase();
        });
    }

    /**
     *
     * @param {array} model - the model to sort
     * @param {array} iterator - array of props to sort by
     * @param {boolean} camelCase - camelCase prop iterator
     * @private
     */
    function _sortAsc(model,iterator,camelCase){
        if (camelCase) iterator=_camelCaseIterator(iterator);
        return _.sortByOrder(model,iterator,['asc']);
    }

    /**
     *
     * @param {array} model - the model to sort
     * @param {array} iterator - array of props to sort by
     * @param {boolean} camelCase - camelCase prop iterator
     * @private
     */
    function _sortDesc(model,iterator,camelCase){
        if (camelCase) iterator=_camelCaseIterator(iterator);
        return _.sortByOrder(model,iterator,['desc']);
    }

    function _delete(model,id){
        var index=_getIndex(model,id);
        model.splice(index, 1);
        return model;
    }

    function _deleteRange(model,arr){

        for(var i=0;i<arr.length;i++){
            var id=arr[i];
            _delete(model,id);
        }
    }

    function _replace(model,id,newObj){
        var old=_get(model,id);
        for(var key in old){
            if(old.hasOwnProperty(key)){
                if(newObj[key] !==undefined) old[key]=newObj[key];
            }
        }
    }


    function GenericRepository(model,fn){
        var length=arguments.length;
        if(length===0) throw 'Generic Repository requires an array model passed in the constructor';
        if(typeof fn !=='function') fn=null;
        this.model=model;
        this.callback=fn;
        this.camelCaseSort=true;

        this.get=function(params,resource,query,callback){
            if(resource && typeof resource==='object'){
                callback=query;
                query=resource;
            }else if(resource && typeof resource==='function'){
                callback=resource;
                resource=null;
            }
            var model=this.model;
            var result;
            if(params && params.id) result= _get(model,params.id);
            else if(query && query.filter && query.filter !==undefined) result=this.query(query.filter);
            else result= model;

            if(query && query.orderBy && query.orderBy !==undefined) result=this.orderBy(result,query.orderBy);

            if(query && query.orderByDesc && query.orderByDesc !==undefined) result=this.orderByDesc(result,query.orderByDesc);

            if(query && query.paginate) result=this.paginate(result,query.paginate);

            if(this.callback) this.callback(result,'get',params,callback);
            else return (callback) ? callback(null,result) : result;
        };

        this.post=function(params,resource,callback){
            var origParams=params;
            if(typeof resource !=='string') callback=resource;
            var model=this.model;
            if(!params.id) params.id=_guid();
            params=this._post(params);
            model.push(params);
            this.onChange(model);
            if(this.callback) this.callback(params,'post',origParams,callback);
            else return (callback) ? callback(null,params) : params;
        };

        this.put=function(params,resource,callback){
            if(typeof resource !=='string') callback=resource;
            var model=this.model;
            params=this._put(params);
            _replace(model,params.id,params);
            this.onChange(model);
            if(this.callback) this.callback(params,'put',params,callback);
            else return (callback) ? callback(null,params) : params;
        };

        this.delete=function(params,resource,callback){
            if(typeof resource !=='string') callback=resource;
            if(params.id) _delete(model,params.id);
            else if(params.ids) _deleteRange(model,params.ids);
            this.onChange(model);
            if(this.callback) this.callback(null,'delete',params,callback);
            else return (callback) ? callback(null,null) : null;
        };

        this.Enumerable=function(){
            return Enumerable.From(this.model);
        };

        this.query=function(filter,toEnumerable){
            return this.model;
        };

        this.onChange=function(model){};

        this.orderBy=function(result,prop){
            var orderByIterator=[];
            orderByIterator.push(prop);
            return _sortAsc(result,orderByIterator,this.camelCaseSort);
        };

        this.orderByDesc=function(result,prop){
            var orderByDescIterator=[];
            orderByDescIterator.push(prop);
            return _sortDesc(result,orderByDescIterator,this.camelCaseSort);
        };

        this.paginate=function(result,paginate){
            var count=result.length;
            var pageSize=paginate.pageSize;
            var page=paginate.page;
            if(!page) page=1;
            var p=_getStartEndParams(page,pageSize,count);
            var data=_getDataPage(result,p);
            return {data:data,count:count};
        };

        this._get=function(params,query,callback){
            var model=this.model;
            var result;
            if(query && query.filter && query.filter !==undefined) result=this.query(query.filter);
            else result= model;

            if(query && query.orderBy && query.orderBy !==undefined) result=this.orderBy(result,query.orderBy);

            if(query && query.orderByDesc && query.orderByDesc !==undefined) result=this.orderByDesc(result,query.orderByDesc);

            if(query && query.paginate) result=this.paginate(result,query.paginate);

            if(this.callback) this.callback(result,'get',params,callback);
            else return (callback) ? callback(null,result) : result;
        };

        this._post=function(data){
            return data;
        };

        this._put=function(data){
            return data;
        };


    }

    return GenericRepository;

}));
