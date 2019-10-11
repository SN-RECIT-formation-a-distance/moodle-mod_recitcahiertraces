var recit = recit || {};
recit.report = recit.report || {};

recit.report.DiagTag = class
{
    static i18n = {
        display_options: {en: "Display Options", fr: "Option d'affichage"},
        success_range: {en: "Success Range", fr: "Intervalle de réussite"},
        warning_range: {en: "Warning Range", fr: "Intervalle d'alerte"},
        danger_range: {en: "Danger Range", fr: "Intervalle de danger"},
        and: {en: "and", fr: "et"},
        displayAs: {en: "Display As", fr: "Afficher comme"},
        table: {en: "Table", fr: "Tableau"},
        list: {en: "List", fr: "Liste"},
        noData: {en: "No data", fr: "Pas de données"},
        full_name: {en: "Full Name", fr: "Nom complet"},
        email: {en: "Email", fr: "Courriel"},
        selectGroup: {en: "Select the group", fr: "Sélectionnez le groupe"},
        selectOption: {en: "Select your option", fr: "Sélectionnez votre option"},
        downloadCsv: {en: "Download in CSV", fr: "Télécharger en CSV"}
    };

    constructor(id){
        this.id = id;
        this.dom = null;
        this.i18n = {};
        this.htmlCellContext = null
        this.refs = {form: null, resultArea: null, footer: null, table: null, tiles: null, groupList: null, groupOverview: null};
        this.data = null;
        this.options = {displayAsTable: false};
        
        this.preInit = this.preInit.bind(this);
        this.init = this.init.bind(this);
        this.onLoadDataResult = this.onLoadDataResult.bind(this);
        this.onDrawTable = this.onDrawTable.bind(this);
        this.onDrawTile = this.onDrawTile.bind(this);
        this.refresh = this.refresh.bind(this);
        this.onGroupListSelect = this.onGroupListSelect.bind(this);
    }

    preInit(){
        this.dom = document.getElementById(this.id);
        this.setCurrentLanguage(this.dom.getAttribute("data-lang"));

        this.refs.resultArea = document.createElement("div");
        this.refs.resultArea.style.width = "100%";
      
        this.refs.table = new recit.components.Table();                
        this.refs.tiles = [];        
        this.refs.groupOverview = new recit.components.Tile();
        this.refs.groupList = new recit.components.SelectCtrl();

        this.loadData();
    }

    init(){
        this.initForm();
        this.dom.appendChild(this.refs.resultArea);
        this.initFooter();
    }

    setCurrentLanguage(lang){
        lang = lang.substr(0,2); // fr_ca = fr
        for(let key in recit.report.DiagTag.i18n){
            this.i18n[key] = recit.report.DiagTag.i18n[key][lang];
        }
    }

    initForm(){
        this.refs.form = document.createElement("form");
        this.refs.form.style.padding = "15px";
        
        let element = document.createElement("legend");
        element.innerHTML = this.i18n.display_options;
        this.refs.form.appendChild(element);

        let container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexWrap = "wrap";
        this.refs.form.appendChild(container);

        container.appendChild(this.createMinMaxComp(this.i18n.success_range + " (%)", "minSuccess", "maxSuccess", this.htmlCellContext.minSuccess, this.htmlCellContext.maxSuccess));
        container.appendChild(this.createMinMaxComp(this.i18n.warning_range + " (%)", "minWarning", "maxWarning", this.htmlCellContext.minWarning, this.htmlCellContext.maxWarning));
        container.appendChild(this.createMinMaxComp(this.i18n.danger_range + " (%)", "minDanger", "maxDanger", this.htmlCellContext.minDanger, this.htmlCellContext.maxDanger));
        this.refs.form.appendChild(this.createDisplayType());

        this.dom.appendChild(this.refs.form);

       // element = document.createElement("hr");
        //this.dom.appendChild(element);

        element = document.createElement("label");
        element.innerHTML = this.i18n.selectGroup + ":";
        this.refs.form.appendChild(element);
        
        this.refs.groupList.placeholderDesc = this.i18n.selectOption;
        this.refs.groupList.dom.onchange = this.onGroupListSelect;
        this.refs.form.appendChild(this.refs.groupList.dom);
    }

    createMinMaxComp(labelText, name1, name2, val1, val2){
        let that = this;
        let container = document.createElement("div");
        container.style.marginRight = "60px";
        container.classList.add("form-group");

        let label = document.createElement("label");
        label.classList.add("control-label");
        label.style.display = "block";
        label.innerHTML = labelText;
        container.appendChild(label);

        let input1 = document.createElement("input");
        input1.type = "text";
        input1.classList.add("form-control");
        input1.style.width = "80px";
        input1.style.display = "inline";
        input1.value = val1;
        input1.name = name1;
        input1.onfocusout = function(event){
            that.htmlCellContext[event.target.name] = parseFloat(event.target.value);
            that.refresh();
        }
        container.appendChild(input1);

        let aux = document.createElement("label");
        aux.innerHTML = this.i18n.and;
        aux.style.marginLeft = "5px";
        aux.style.marginRight = "5px";
        container.appendChild(aux);

        let input2 = document.createElement("input");
        input2.type = "text";
        input2.classList.add("form-control");
        input2.style.width = "80px";
        input2.style.display = "inline";
        input2.value = val2;
        input2.name = name2;
        input2.onfocusout = input1.onfocusout;
        container.appendChild(input2);

        return container;
    }

    createDisplayType(){
        let container = document.createElement("div");
        container.classList.add("form-group");

        let label = document.createElement("label");
        label.classList.add("control-label");
        
        label.innerHTML = this.i18n.displayAs + ": ";
        container.appendChild(label);

        if(this.options.displayAsTable){
            let label1 = document.createElement("label");
            label1.innerHTML = this.i18n.table;
            label1.style.marginLeft = "15px";
            
            container.appendChild(label1);
            let input1 = document.createElement("input");
            input1.style.margin = "5px";
            input1.type = "radio";
            input1.value = "tbl";
            input1.name = "displayAs";
            input1.checked = true;
            input1.onclick = this.refresh;
            label1.appendChild(input1);
        }
       
        let label2 = document.createElement("label");
        label2.innerHTML = this.i18n.list;
        label2.style.marginLeft = "15px";
        label2.style.marginRight = "5px";
        container.appendChild(label2);
        let input2 = document.createElement("input");
        input2.style.margin = "5px";
        input2.type = "radio";
        input2.value = "tile";
        input2.name = "displayAs";
        input2.checked = true;
        input2.onclick = this.refresh;
        label2.appendChild(input2);

        return container;
    }

    onGroupListSelect(event){
        let groupName = this.data.groupList[this.refs.groupList.selectedIndex()];

        let students = this.data.students.filter(function(item){
            return item.groupName.includes(groupName);
        });

        let group = this.data.groups.filter(function(item){
            return item.groupName.includes(groupName);
        });

        this.showResultAsTable(students);
        this.showResultAsTile(students);
        this.showGroupOverview(group.shift());
        this.refresh();
    }

    initFooter(){
        this.refs.footer = document.createElement("div");
        this.refs.footer.appendChild(document.createElement("hr"));
        
        let link = document.createElement("a");
        link.target = '_blank';        
        link.href = this.downloadCsvLink();
        link.innerHTML = this.i18n.downloadCsv;
        this.refs.footer.appendChild(link);

        this.dom.appendChild(this.refs.footer);
    }

    downloadCsvLink(){
        let params = recit.utils.getUrlVars();
        return `${recit.http.WebApi.instance().gateway}?service=getReportDiagTag&courseId=${params.id}&output=csv`;
    }

    loadData(){
        let params = recit.utils.getUrlVars();
        recit.http.WebApi.instance().getReportDiagTag({courseId: params.id}, this.onLoadDataResult.bind(this));
    }

    onLoadDataResult(result){
        if(!result.success){
            console.log(result);
            return;
        }

        this.data = result.data;
        this.htmlCellContext = result.data.htmlCellContext;
        
        this.refs.groupList.disposeData();
        for(let groupName of this.data.groupList){
            this.refs.groupList.addItem(groupName, groupName, false);
        }

        this.init();

        this.refs.groupList.refresh();
                
        this.refresh();
    }

    showResultAsTable(data){
        if(data.length === 0){ return; }

        this.refs.table.disposeData();

        let tagList = data[0].tags;

        let header = [];
        header.push({text: this.i18n.full_name, orderBy: true});
        header.push({text:  this.i18n.email, orderBy: false});

        for(let item of tagList){
            header.push({text: item.tagName, orderBy: false});
        }

        this.refs.table.addHeader(header);

        for(let item of data){
            let row = [];
            row.push({text:item.firstName + " " + item.lastName, value: item.firstName + " " + item.lastName});
            row.push({text:item.email, value: item.email});
            for(let tag of item.tags){
                row.push({text: parseFloat(tag.value).toFixed(1) + "%", value: tag.value, cellType: 't'});
            }
            this.refs.table.addRow(row);
        }
    }
    
    onDrawTable(element, data){
        if(data === null){
            element.innerHTML = this.i18n.noData;
        }
        else{
            if(data.cellType === 't'){
                element.setAttribute("data-context", this.getCellContext(data.value));
                element.style.textAlign = "right";
            }
            
            element.innerHTML = data.text;
        }
    }

    showResultAsTile(data){
        this.refs.tiles = [];

        for(let item of data){
            let tile = new recit.components.Tile();
            tile.setTitle(`${item.firstName} ${item.lastName} (${item.email})`);

            for(let tag of item.tags){
                tile.addItem({tagName: tag.tagName, text: parseFloat(tag.value).toFixed(1) + "%", value: tag.value});
            }
            this.refs.tiles.push(tile);
        }
    }

    showGroupOverview(data){
        if(data === null){ return; }

        this.refs.groupOverview.disposeData();
        this.refs.groupOverview.setTitle(`${data.groupName}`);

        for(let tag of data.tags){
            this.refs.groupOverview.addItem({tagName: tag.tagName, text: parseFloat(tag.value).toFixed(1) + "%", value: tag.value});
        }
    }

    onDrawTile(element, data){
        if(data === null){
            element.innerHTML = this.i18n.noData;
        }
        else{
            let content = document.createElement("div");
            let el = document.createElement("div");
            el.innerHTML = data.tagName;
            content.appendChild(el);
            el = document.createElement("div");
            el.innerHTML = data.text;
            content.appendChild(el);
            element.setAttribute("data-context", this.getCellContext(data.value));
            element.appendChild(content);
        }
    }

    getCellContext(grade){
        grade = parseFloat(grade);

        let context = "";

        if(grade >= this.htmlCellContext.minSuccess && grade <= this.htmlCellContext.maxSuccess){
            context = 'success';
        }
        else if(grade >= this.htmlCellContext.minWarning && grade < this.htmlCellContext.maxWarning){
            context = 'warning';
        }
        else if(grade >= this.htmlCellContext.minDanger && grade < this.htmlCellContext.maxDanger){
            context = 'danger';
        }

        return context;
    }

    refresh(){      
        while (this.refs.resultArea.firstChild !== null){ 
            this.refs.resultArea.removeChild(this.refs.resultArea.firstChild);
        }
        
        if(this.refs.form.displayAs.value === 'tbl'){
            this.refs.table.clearRows();
            this.refs.table.draw(this.onDrawTable);
            this.refs.resultArea.appendChild(this.refs.table.dom);
        }
        else{ 
            for(let tile of this.refs.tiles){
                tile.clear();
                tile.draw(this.onDrawTile);
                this.refs.resultArea.appendChild(tile.dom);
                this.refs.resultArea.appendChild(document.createElement("br"));
            }
        }
        
        this.refs.groupOverview.clear();
        if(this.refs.groupOverview.data.length >0){
            this.refs.resultArea.appendChild(document.createElement("br"));
            this.refs.groupOverview.draw(this.onDrawTile);
            this.refs.resultArea.appendChild(this.refs.groupOverview.dom);
        }
    }
}

recit.report.DiagTagQuestion = class extends recit.report.DiagTag 
{
    constructor(id){
        super(id);

        this.options.displayAsTable = true;
    }

    loadData(){
        let params = recit.utils.getUrlVars();
        recit.http.WebApi.instance().getReportDiagTag({cmId: params.id, options: "question"}, this.onLoadDataResult.bind(this));
    }

    downloadCsvLink(){
        let params = recit.utils.getUrlVars();
        return `${recit.http.WebApi.instance().gateway}?service=getReportDiagTag&cmId=${params.id}&output=csv&options=question`;
    }
}