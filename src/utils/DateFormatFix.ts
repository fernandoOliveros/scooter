class DateFormatFix {
    //Atributtes
    public day: number;
    public month: number;
    public year: number;
    public hour: number;
    public min: number;

    constructor(dateType: Date){
        this.day = dateType.getDate();
        this.month = dateType.getMonth();
        this.year = dateType.getFullYear();
        this.hour = dateType.getHours();
        this.min = dateType.getMinutes();
    }

    getSubtractDate(days: number){
        let date = new Date();
        date.setDate( date.getDate() - days  );
        this.day = date.getDate();
        this.month = date.getMonth();
        this.year = date.getFullYear();
        return this.getDate();
    }

    getDate(){
        //Number
        let month : number = this.month + 1;
        let day :number = this.day;
        //return's
        let m : string = (month < 10) ? "0" + String(month) : String(month);;
        let d : string = (day < 10) ? "0" + String(day) : String(day);
        let y: string = String(this.year);
        
        return y + "-" + m + "-" + d;
    }

    getDateTime(){
        return this.getDate() + " " + this.hour + ":" + this.min + ":00";
    }

    getFormat(){
        let hr, min, day, month;
        this.hour > 9 ? hr = this.hour : hr = "0" + this.hour;
        this.min > 9 ? min = this.min : min = "0" + this.min;
        this.day > 9 ? day = this.day : day = "0" + this.day;
        this.month + 1 > 9 ? month = (this.month + 1) : month = "0" + (this.month + 1);
        return day + "/" + month + "/" + this.year + " " + hr + ":" + min;
    }

    getFormatMin(){
        return ( this.day )+ "/" + (this.month + 1) + "/" + this.year;
    }

    getFormatName(){
        let monthName = ""
        switch( this.month ){
            case 0 : monthName = "Enero"; break;
            case 1 : monthName = "Febrero"; break;
            case 2 : monthName = "Marzo"; break;
            case 3 : monthName = "Abril"; break;
            case 4 : monthName = "Mayo"; break;
            case 5 : monthName = "Junio"; break;
            case 6 : monthName = "Julio"; break;
            case 7 : monthName = "Agosto"; break;
            case 8 : monthName = "Septiembre"; break;
            case 9 : monthName = "Octubre"; break;
            case 10 : monthName = "Noviembre"; break;
            case 11 : monthName = "Diciembre"; break;
            default : monthName = "Not found"
        }
        return ( this.day ) + " de " + monthName + " " + this.year ;
    }
}

export default DateFormatFix;