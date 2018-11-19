var j = jQuery.noConflict();
var defaultPagePath='app/pages/';
var headerMsg = "Expenzing";
//var urlPath = 'http://1.255.255.36:13130/TnEV1_0AWeb/WebService/Login/'
//var WebServicePath ='http://1.255.255.214:8085/NexstepWebService/mobileLinkResolver.service';
 var WebServicePath = 'http://live.nexstepapps.com:8284/NexstepWebService/mobileLinkResolver.service';
//var WebServicePath ='http://1.255.255.197:8082/NexstepWebService/mobileLinkResolver.service';
var clickedFlagCar = false;
var clickedFlagTicket = false;
var clickedFlagHotel = false;
var clickedCarRound = false;
var clickedTicketRound = false;
var clickedHotelRound = false;
var perUnitDetailsJSON= new Object();
var ismodeCategoryJSON=new Object();
var exceptionStatus = 'N';
var exceptionMessage='';
var expenseClaimDates=new Object();
var successMessage;
var pictureSource,destinationType;
var camerastatus;
var voucherType;
var fileTempCameraBE ="";
var fileTempCameraTS ="";
var fileTempGalleryBE ="";
var fileTempGalleryTS ="";
var mapToCalcERAmt = new Map();
var requestRunning = false;
var flagForUnitEnable = false;
var smsList = [];     
var smsBodyString = "";  
var smsToExpenseStr = "" ;
var smsWatchFlagStatus = false;
var expensePageFlag = '';		//S for smsExpenses And N for normal expenses
var filtersStr = "";
j(document).ready(function(){ 
document.addEventListener("deviceready",loaded,false);
});

function login()
   {
   	if(document.getElementById("userName")!=null){
    var userName = document.getElementById("userName");
	}else if(document.getElementById("userName")!=null){
		var userName = document.getElementById("userNameId");
	}
	var password = document.getElementById("pass");
    
    var jsonToBeSend=new Object();
    jsonToBeSend["user"] = userName.value;
    jsonToBeSend["pass"] = password.value;
	//setUrlPathLocalStorage(urlPath);
	urlPath=window.localStorage.getItem("urlPath");
	alert('url path : ' + urlPath);
	j('#loading').show();
    j.ajax({
         url: urlPath+"LoginWebService",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToBeSend),
         success: function(data) {
         	if (data.Status == 'Success'){
                alert('data : ' + JSON.stringify(data));
                console.log('data : ' + JSON.stringify(data));
                if(data.hasOwnProperty('multiLangInMobile') && data.multiLangInMobile != null &&
                   data.multiLangInMobile){
                   	alert('multiLangInMobile');
                       	var headerBackBtn=defaultPagePath+'withoutBckBtn.html';
	                    var pageRef=defaultPagePath+'language.html';
                    j('#mainHeader').load(headerBackBtn);
                    j('#mainContainer').load(pageRef); 
                       appPageHistory.push(pageRef);
                    setUserStatusInLocalStorage("Valid");
			        setUserSessionDetails(data,jsonToBeSend);
                    j('#loading').hide();         
        }else{
        	alert('not multiLangInMobile');
            var headerBackBtn=defaultPagePath+'categoryMsgPage.html';
	        var pageRef=defaultPagePath+'category.html';
        	 j('#mainHeader').load(headerBackBtn);
             j('#mainContainer').load(pageRef);
              appPageHistory.push(pageRef);
			  //addEmployeeDetails(data);
                 
			  setUserStatusInLocalStorage("Valid");
			  setUserSessionDetails(data,jsonToBeSend);
                           
                if(data.hasOwnProperty('EaInMobile') && 
                 data.EaInMobile != null){
                  if(data.EaInMobile){
                 synchronizeEAMasterData();
                  }
               }
            
			  if(data.TrRole){
				synchronizeTRMasterData();
				synchronizeTRForTS();  
			  }
                synchronizeBEMasterData();
                
                
            if(data.hasOwnProperty('smartClaimsViaSMSOnMobile') && 
                 data.smartClaimsViaSMSOnMobile != null){
                  if(data.EaInMobile){
                 synchronizeWhiteListMasterData();
	               startWatch();
                  }
                 }
                }
			
			}else if(data.Status == 'Failure'){
 			   successMessage = data.Message;
			   if(successMessage.length == 0){
					successMessage = "Wrong UserName or Password";
				}
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			   j('#loading').hide();
           }else{
			    j('#loading').hide();
            alert(window.lang.translate('Please enter correct username or password'));
           }

         },
         error:function(data) {
		   j('#loading').hide();
         }
   });

}
 
function commanLogin(){
	alert('first');
 	var userName = document.getElementById("userName");
 	var userNameValue = userName.value; 
 	var domainName = userNameValue.split('@')[1];
	 var jsonToDomainNameSend = new Object();
	jsonToDomainNameSend["userName"] = domainName;
	//jsonToDomainNameSend["mobilePlatform"] = device.platform;
	jsonToDomainNameSend["mobilePlatform"] = "Android";
	jsonToDomainNameSend["appType"] = "NEXGEN_EXPENZING_TNE_APP";
  	//var res=JSON.stringify(jsonToDomainNameSend);
	var requestPath = WebServicePath;
	j.ajax({
         url: requestPath,
         type: 'POST',
         contentType : "application/json",
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToDomainNameSend),
		 success: function(data) {
         	if (data.status == 'Success'){
         		urlPath = data.message;
         		setUrlPathLocalStorage(urlPath);
         		login();
        	}else if(data.status == 'Failure'){
				successMessage = data.message;
				document.getElementById("loginErrorMsg").innerHTML = successMessage;
 			   j('#loginErrorMsg').hide().fadeIn('slow').delay(2000).fadeOut('slow');
 			}else{
 				successMessage = data.message;
 				if(successMessage == "" || successMessage == null){
                alert(window.lang.translate('Please enter correct username or password'));		
				}else{
                alert(window.lang.translate(successMessage));
 				}	
 			}
		},
         error:function(data) {
		   
         }
   });
}

  function createBusinessExp(){
	resetImageData();
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
    var pageRef=defaultPagePath+'addAnExpense.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }

	 function displayBusinessExp(){
		 
    var headerBackBtn=defaultPagePath+'headerPageForBEOperation.html';
     var pageRef=defaultPagePath+'fairClaimTable.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }

	 function displayTSExp(){
		 
		 var headerBackBtn=defaultPagePath+'headerPageForTSOperation.html';
		var pageRef=defaultPagePath+'travelSettlementTable.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
		appPageHistory.push(pageRef);
	 }

	 function cerateTravelReq(){
		 
      var pageRef=defaultPagePath+'addToTravelRequest.html';
      var headerBackBtn=defaultPagePath+'backbtnPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }


	 function createWallet(){
		 
		 var headerBackBtn=defaultPagePath+'headerPageForWalletOperation.html';
		 var pageRef=defaultPagePath+'addToWallet.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
	 }

 function init() {
	 var pgRef;
	var headerBackBtn;
	if(window.localStorage.getItem("EmployeeId")!= null){
		if(window.localStorage.getItem("UserStatus")=='ResetPswd'){
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
			pgRef=defaultPagePath+'loginPageResetPswd.html';
		}else if(window.localStorage.getItem("UserStatus")=='Valid'){
			pgRef=defaultPagePath+'category.html';
			headerBackBtn=defaultPagePath+'categoryMsgPage.html';
		}else{
			headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		    pgRef=defaultPagePath+'loginPage.html';
		}
	}else{
		headerBackBtn=defaultPagePath+'expenzingImagePage.html';
		pgRef=defaultPagePath+'loginPage.html';
	}
	
	j(document).ready(function() {
		j('#mainHeader').load(headerBackBtn);
			j('#mainContainer').load(pgRef);
			j('#mainContainer').load(pgRef,function() {
  						if(window.localStorage.getItem("UserStatus")!=null
  							&& window.localStorage.getItem("UserStatus")=='ResetPswd'){
  							document.getElementById("userName").value=window.localStorage.getItem("UserName");
  						}
		 			  
					});
			j('#mainContainer').swipe({
				swipe:function(event,direction,distance,duration,fingercount){
					switch (direction) {
						case "right":
								goBack();
								break;
						default:

					}
				},
				 threshold:200,
				allowPageScroll:"auto"
			});
	});
	appPageHistory.push(pgRef);
 }
 
  function loaddate(){
	j(function(){
		window.prettyPrint && prettyPrint();
		j('.dp1').datepicker({
			format: 'dd-mm-yyyy'
		});		
	});

	j('.dp1').on('changeDate', function(ev){
		j(this).datepicker('hide');
	});

}
 

function isJsonString(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}
				
 
function viewBusinessExp(){
   var pageRef=defaultPagePath+'fairClaimTable.html';
   //var headerBackBtn=defaultPagePath+'headerPageForBEOperation.html';
	j(document).ready(function() {	
		//j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
    appPageHistory.push(pageRef);
    j('#loading_Cat').hide();
}


function viewTravelSettlementExp(){
	resetImageData();
    var pageRef=defaultPagePath+'travelSettlementTable.html';
    var headerBackBtn=defaultPagePath+'headerPageForTSOperation.html';
			j(document).ready(function() {
				
				j('#loading_Cat').hide();
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
      appPageHistory.push(pageRef);
     }
	 
function saveBusinessExpDetails(jsonBEArr,busExpDetailsArr){
	 var jsonToSaveBE = new Object();
	 var headerBackBtn=defaultPagePath+'backbtnPage.html';
	 jsonToSaveBE["employeeId"] = window.localStorage.getItem("EmployeeId");;
	 jsonToSaveBE["ProcessStatus"] = "0";
	 jsonToSaveBE["expenseDetails"] = jsonBEArr;
	 requestRunning = true;
	 var pageRefSuccess=defaultPagePath+'success.html';
     var pageRefFailure=defaultPagePath+'failure.html';
	 j('#loading_Cat').show();
	 j.ajax({
				  url: window.localStorage.getItem("urlPath")+"BusExpService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveBE),
				  success: function(data) {
				  	if(data.Status=="Success"){
				  		successMessage = "Record(s) has been synchronized successfully.";
						 for(var i=0; i<busExpDetailsArr.length; i++ ){
							var businessExpDetailId = busExpDetailsArr[i];
							deleteSelectedExpDetails(businessExpDetailId);
						 }
						 requestRunning = false;
						 j('#mainHeader').load(headerBackBtn);
						 j('#mainContainer').load(pageRefSuccess);
						 //appPageHistory.push(pageRef);
					 }else if(data.Status=="Error"){
					 	requestRunning = false;
					 	successMessage = "Oops!! Something went wrong. Please contact system administrator";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 }else{
					 	requestRunning = false;
					 	successMessage = "Error in synching expenses. Please contact system administrator";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 } 
				  },
				  error:function(data) {
					  j('#loading_Cat').hide();
					  requestRunning = false;
                    alert(window.lang.translate('Error: Oops something is wrong, Please Contact System Administer'));	
                      
				  }
			});
}

function saveTravelSettleExpDetails(jsonTSArr,tsExpDetailsArr){
	var headerBackBtn=defaultPagePath+'backbtnPage.html';
	 var jsonToSaveTS = new Object();
	 jsonToSaveTS["employeeId"] = window.localStorage.getItem("EmployeeId");
	 jsonToSaveTS["expenseDetails"] = jsonTSArr;
	 requestRunning = true;
     var pageRefSuccess=defaultPagePath+'success.html';
     var pageRefFailure=defaultPagePath+'failure.html';
	j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SyncSettlementExpensesWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveTS),
				  success: function(data) {
				  	if(data.Status=="Success"){
				  	successMessage = "Record(s) has been synchronized successfully.";
					 for(var i=0; i<tsExpDetailsArr.length; i++ ){
						var travelSettleExpDetailId = tsExpDetailsArr[i];
						deleteSelectedTSExpDetails(travelSettleExpDetailId);
					 }
					 requestRunning = false;
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRefSuccess);
					 }else if(data.Status=="Error"){
					 	requestRunning = false;
						successMessage = "Oops!! Something went wrong. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 }else{
					 	requestRunning = false;
						successMessage = "Error in synching expenses. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 }
				  },
				  error:function(data) {
				  	requestRunning = false;
                    alert(window.lang.translate('Error: Oops something is wrong, Please Contact System Administer'));
				  }
			});
}

function sendForApprovalBusinessDetails(jsonBEArr,busExpDetailsArr,accountHeadID){
	 var jsonToSaveBE = new Object();
	 jsonToSaveBE["employeeId"] = window.localStorage.getItem("EmployeeId");
	 jsonToSaveBE["expenseDetails"] = jsonBEArr;
	 jsonToSaveBE["startDate"]=expenseClaimDates.minInStringFormat;
	 jsonToSaveBE["endDate"]=expenseClaimDates.maxInStringFormat;
	 jsonToSaveBE["DelayAllowCheck"]=false;
	 jsonToSaveBE["BudgetingStatus"]=window.localStorage.getItem("BudgetingStatus");
	 jsonToSaveBE["accountHeadId"]=accountHeadID;
	 jsonToSaveBE["ProcessStatus"] = "1";
	 jsonToSaveBE["title"]= window.localStorage.getItem("FirstName")+"/"+jsonToSaveBE["startDate"]+" to "+jsonToSaveBE["endDate"];
	
     var pageRefSuccess=defaultPagePath+'success.html';
     var pageRefFailure=defaultPagePath+'failure.html';
	 callSendForApprovalServiceForBE(jsonToSaveBE,busExpDetailsArr,pageRefSuccess,pageRefFailure);
	 
}

function callSendForApprovalServiceForBE(jsonToSaveBE,busExpDetailsArr,pageRefSuccess,pageRefFailure){
j('#loading_Cat').show();
var headerBackBtn=defaultPagePath+'backbtnPage.html';
j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SynchSubmitBusinessExpense",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonToSaveBE),
				  success: function(data) {
				  	if(data.Status=="Success"){
					  	if(data.hasOwnProperty('DelayStatus')){
					  		setDelayMessage(data,jsonToSaveBE,busExpDetailsArr);
					  		 j('#loading_Cat').hide();
					  	}else{
						 successMessage = data.Message;
						 for(var i=0; i<busExpDetailsArr.length; i++ ){
							var businessExpDetailId = busExpDetailsArr[i];
							deleteSelectedExpDetails(businessExpDetailId);
						 }
						 requestRunning = false;
						 j('#loading_Cat').hide();
						 j('#mainHeader').load(headerBackBtn);
						 j('#mainContainer').load(pageRefSuccess);
						// appPageHistory.push(pageRef);
						}
					}else if(data.Status=="Failure"){
					 	successMessage = data.Message;
						requestRunning = false;
					 	j('#loading_Cat').hide();
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 }else{
						 j('#loading_Cat').hide();
						successMessage = "Oops!! Something went wrong. Please contact system administrator.";
						j('#mainHeader').load(headerBackBtn);
					 	j('#mainContainer').load(pageRefFailure);
					 }
					},
				  error:function(data) {
					j('#loading_Cat').hide();
					requestRunning = false;
                    alert(window.lang.translate('Error: Oops something is wrong, Please Contact System Administer'));
				  }
			});
}

function createAccHeadDropDown(jsonAccHeadArr){
	var jsonArr = [];
			if(jsonAccHeadArr != null && jsonAccHeadArr.length > 0){
				for(var i=0; i<jsonAccHeadArr.length; i++ ){
					var stateArr = new Array();
					stateArr = jsonAccHeadArr[i];
					jsonArr.push({id: stateArr.Label,name: stateArr.Value});
				}
			}
			jsonArr.sort(function(a, b){ // sort object by Account Head Name
			var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase()
			if (nameA < nameB) //sort string ascending
				return -1 
			if (nameA > nameB)
				return 1
			return 0 //default return value (no sorting)
			})
			j("#accountHead").select2({
				data:{ results: jsonArr, text: 'name' },
				minimumResultsForSearch: -1,
				initSelection: function (element, callback) {
					callback(jsonArr[4]);
					 getExpenseNamesBasedOnAccountHead();
				},
				formatResult: function(result) {
					if ( ! isJsonString(result.id))
						result.id = JSON.stringify(result.id);
						return result.name;
				}
			}).select2("val","");
			
}
function createTRAccHeadDropDown(jsonAccHeadArr){
	var jsonArr = [];
	if(jsonAccHeadArr != null && jsonAccHeadArr.length > 0){
		for(var i=0; i<jsonAccHeadArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonAccHeadArr[i];
			jsonArr.push({id: stateArr.Label,name: stateArr.Value});
		}
	}
	j("#trAccountHead").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
}

function createExpNameDropDown(jsonExpNameArr){
	var jsonExpArr = [];
	if(jsonExpNameArr != null && jsonExpNameArr.length > 0){
		for(var i=0; i<jsonExpNameArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonExpNameArr[i];
			jsonExpArr.push({id: stateArr.ExpenseID,name: stateArr.ExpenseName});
		}
	}
	
	document.getElementById("expFromLoc").value = "";
	document.getElementById("expToLoc").value = "";
	document.getElementById("expNarration").value = "";
	document.getElementById("expUnit").value = "";
	document.getElementById("expAmt").value = "";
	$("a").click(function () { 
		$("#mapLink").fadeTo("fast").removeAttr("href"); 
	});
	
	j("#expenseName").select2({
		data:{ results: jsonExpArr, text: 'name' },
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
			callback(jsonExpArr[5]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
}

function createCurrencyDropDown(jsonCurrencyArr){
	var jsonArr = [];
	if(jsonCurrencyArr != null && jsonCurrencyArr.length > 0){
		for(var i=0; i<jsonCurrencyArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCurrencyArr[i];
			
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#currency").select2({
		data:{ results: jsonArr, text: 'name' },
		placeholder: "Currency",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
					callback(jsonArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val",jsonArr[0]);
} 

function createTravelModeDown(jsonTrvlModeArr){
	var jsonArr = [];
	if(jsonTrvlModeArr != null && jsonTrvlModeArr.length > 0){
		for(var i=0; i<jsonTrvlModeArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonTrvlModeArr[i];
			
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#travelMode").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#roundTripMode").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
    
    	j("#travelModeForTS").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 


function createCategoryDropDown(jsonCategoryArr){
	var jsonArr = [];
	if(jsonCategoryArr != null && jsonCategoryArr.length > 0){
		for(var i=0; i<jsonCategoryArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCategoryArr[i];
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#travelCategory").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#roundTripCategory").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
    
    	j("#travelCategoryForTS").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: -1,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
}


function createCitytownDropDown(jsonCityTownArr){
	var jsonArr = [];
	if(jsonCityTownArr != null && jsonCityTownArr.length > 0){
		for(var i=0; i<jsonCityTownArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonCityTownArr[i];
			jsonArr.push({id: stateArr.Value,name: stateArr.Label});
		}
	}
		
	j("#fromCitytown").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: 2,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
	
	j("#toCitytown").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: 2,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
    
    
    	j("#Citytown").select2({
		data:{ results: jsonArr, text: 'name' },
		minimumResultsForSearch: 2,
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	});
} 


function createTravelTypeDropDown(jsonTravelTypeArr){
	var jsonArr = [];
	if(jsonTravelTypeArr != null && jsonTravelTypeArr.length > 0){
		for(var i=0; i
