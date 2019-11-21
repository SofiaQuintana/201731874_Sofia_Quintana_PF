
/*
Metodo encargado de la lectura del archivo de entrada.
 */
function readFile(files) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
        var textArea = document.getElementById("textArea");
        textArea.textContent = e.target.result;
        };
        reader.readAsText(file);
    }

/*
Metodo encargado de imprimir en el textArea outPut el resumen del analisis lexico
*/
function writeOutput() {
var salida = "";
document.getElementById("output").innerHTML =  " ";

     for(var i = 0; i < errorLexemes.length; i++){
        salida = salida + "Lexema: " + errorLexemes[i] + "  Token: " + errorTokens[i] + "     Fila: " + errorRows[i] + "  Columna: " + errorColumns[i] + ' \n';
    }  
    document.getElementById("output").innerHTML =  salida;
    for(var i = 0; i < lexemes.length; i++){
        salida = salida + "Lexema: " + lexemes[i] + "  Token: " + tokens[i] + "     Fila: " + lexemeRows[i] + "  Columna: " + lexemeColumns[i] + ' \n';
    }
    document.getElementById("tokens").innerHTML =  salida;
}    




//ANALIZADOR LEXICO---------------------------------------------------------------ANALIZADOR LEXICO---------------------------------------------------------------ANALIZADOR LEXICO 

//Listado de palabras reservada y booleanos
var listReservedWords = ['funcion', 'principal','retornar', 'vacio', 'variable', 'entero', 'decimal', 'booleano', 'cadena', 'caracter', 'si', 'sino', 'mientras', 'para', 'hacer', 'imprimir'];
var listBooleans = ['VERDADERO', 'FALSO'];    
//Constantes del analizador.
const tokenBoolean = "Boolean";
const tokenReservedWord = "Palabra Reservada";
const tokenOperator = "Operador";
const tokenGroup = "Agrupacion";
const tokenSign = "Signo";
const tokenEntireNumber = "Numero Entero";
const tokenFloatingNumber = "Numero Flotante";
const tokenIdentifier = "Identificador";
const tokenString = "Cadena";
const tokenCharacter = "Caracter";
const tokenCommentary = "Comentario";
const tokenError = "Error";
//Arrays utilizados para almacenar los lexemas y tokens analizados.
var lexemes;
var errorLexemes; 
var tokens; 
var error;
//Arrays utilizados para almacenar filas y columnas.   
var lexemeRows;
var lexemeColumns;
var errorRows;
var errorColumns; 
//Variables utilizadas para almacenar el lexema, el indice, el estado, fila y columna actual.
var currentIndex;
var currentLexeme;
var currentState;
var row;
var column;
//Variables utilizadas para definir el token en turno que se esta reconociendo.
var operator;
var group;
var sign;
var entireNumber;
var floatingNumber;
var identifier;
var string;
var character;
var commentary;
var error;

var showErrorList;
//Funcion encargada de obtener el texto de entrada y proceder con el analisis.
function analyze(){
    this.initialize();
    this.lexicalAnalyzis(document.getElementById("textArea").value);
}

//Funcion encargada de inicializar las variables de la clase.
function initialize(){
    lexemes = new Array();
    errorLexemes = new Array();
    tokens = new Array();
    errorTokens = new Array();
    lexemeRows = new Array();
    lexemeColumns = new Array();
    errorRows = new Array();
    errorColumns = new Array(); 
    currentLexeme = "";
    currentIndex = 0;
    row = 1;
    column = 0;
    currentState = "q0";
    operator = false;
    group = false;
    sign = false;
    entireNumber = false;
    floatingNumber = false;
    identifier = false;
    string = false;
    character = false;
    commentary = false;
    error = false;
    showErrorList = false;
}

/*
Funcion encargada de realizar el analizis lexico. 
*/
function lexicalAnalyzis(text){
//Se repetira el bucle mientras el indice actual sea mayor o igual a la longitud total del texto que se recibe como parametro.    
while(currentIndex <= text.length){      
//Se valida si algun tipo de token se esta reconociendo actualmente y se llama a la funcion de analisis correspondiente, de lo contrario se establece el tipo de token a reconocer.    
    if(operator === true){
        this.analyzeOperator(text.charCodeAt(currentIndex), text.charAt(currentIndex));
    }
    else if(group === true){
        this.analyzeGroup(text.charAt(currentIndex));
    }
    else if(sign === true){
        this.analyzeSign(text.charAt(currentIndex));
    }
    else if(entireNumber === true){
        this.analyzeEntireNumber(text.charCodeAt(currentIndex), text.charAt(currentIndex));
    }
    else if(floatingNumber === true){
        this.analyzeFloatingNumber(text.charCodeAt(currentIndex), text.charAt(currentIndex));
    }
    else if(error === true){
        this.analyzeError(text.charAt(currentIndex));
    }
    else if(identifier === true){
        this.analyzeIdentifier(text.charCodeAt(currentIndex), text.charAt(currentIndex));
    }
    else if(character === true){
        this.analyzeCharacter(text.charCodeAt(currentIndex), text.charAt(currentIndex));
    }
    else{
        currentState = "q0";
        currentLexeme = "";
        //Se define el tipo de token a analizar en base al caracter actual que se esta leyendo.
        switch(text.charCodeAt(currentIndex)){      
            //Identifier
            case 65: case 66: case 67: case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80:  
            case 81: case 82:  case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: 
            case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105: case 106: case 107: case 108: case 109: case 110: case 111: 
            case 112: case 113:  case 114: case 115: case 116: case 117: case 118: case 119: case 120: case 121: case 122:                                                                   
                identifier = true;
            break;
            //Operator
            case 37: case 42: case 43: case 45: case 47: case 60: case 61: case 62:
                operator = true;
            break; 
            //Group
            case 40: case 41: case 123: case 125:
                group = true;     
            break;
            //Sign
            case 59: case 34: 
                sign = true;
            break;
            //EntireNumber
            case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
                entireNumber = true;
            break;
            //Character
            case 39: 
                character = true;
            break;
            //Line break
            case 10:
                row++;
                column = 0;
                currentIndex++;
            break;
            //Blank space
            case 32:
                column++;
                currentIndex++;
            break;
            //Error 
            default:
                if(Number.isNaN(text.charCodeAt(currentIndex))){
                    currentIndex++;
                }
                else{
                    error = true;
                }
            break; 
        }
    }  

}
if(currentState !== "q0"){
    errorLexemes.push(currentLexeme);
    errorTokens.push(tokenError);  
    this.saveRowsAndColumnsError();
}
//Se imprimen los resultados en el area de texto correspondiente.
writeOutput();
}

/*
Analisis del token Operador
*/
function analyzeOperator(codeAscii, character){
    switch (codeAscii){
        case 37: case 42: case 43: case 45: case 47: 
            if(currentState === "q0"){
                lexemes.push(character);
                tokens.push(tokenOperator);
                column++;
                this.saveRowsAndColumns();
                operator = false;
                currentState = "q0";   
                currentIndex++;
            }
            else{
                lexemes.push(currentLexeme);
                tokens.push(tokenOperator);
                this.saveRowsAndColumns();
                operator = false;
                currentState = "q0";
            }
        break;  
        case 60: case 62: 
            if(currentState === "q0"){
                currentState = "q3";
                currentLexeme = currentLexeme + character;
                column++;
                currentIndex++;
            } 
            else{
                lexemes.push(currentLexeme);
                tokens.push(tokenOperator); 
                this.saveRowsAndColumns();
                operator = false;
                currentState = "q0";
            }
        break;
        case 61:
            if(currentState === "q0"){
                currentState = "q2";
                currentLexeme = currentLexeme + character;
                column++;
                currentIndex++;
            }
            else if(currentState === "q2"){
                currentLexeme = currentLexeme + character;
                lexemes.push(currentLexeme);
                tokens.push(tokenOperator); 
                column++;
                this.saveRowsAndColumns();
                operator = false;
                currentState = "q0";
                currentIndex++;
            }
            else if(currentState === "q3"){
                currentLexeme = currentLexeme + character;
                lexemes.push(currentLexeme);
                tokens.push(tokenOperator);
                column++;
                this.saveRowsAndColumns();
                operator = false;
                currentState = "q0";    
                currentIndex++;
            }
        break; 
        default:
            lexemes.push(currentLexeme);
            tokens.push(tokenOperator); 
            this.saveRowsAndColumns();
            operator = false;
            currentState = "q0";
        break;
    } 
}

/*
Analisis del token Agrupacion
*/
function analyzeGroup(character){
    lexemes.push(character);
    tokens.push(tokenGroup); 
    column++;
    this.saveRowsAndColumns();
    group = false; 
    currentIndex++;
}

/*
Analisis del token Signo
*/
function analyzeSign(character){
    lexemes.push(character);
    tokens.push(tokenSign); 
    column++;
    this.saveRowsAndColumns();
    sign = false;
    currentIndex++;
}

/*
Analisis del token Error
*/
function analyzeError(character){
    errorLexemes.push(character);         
    errorTokens.push(tokenError); 
    column++;
    this.saveRowsAndColumnsError(); 
    error = false;
    currentIndex++;
    showErrorList = true;
}

/*
Analisis del token Numero Entero
*/
function analyzeEntireNumber(codeAscii, character){
    switch(codeAscii){
        case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: 
            currentLexeme = currentLexeme + character;
            column++;
            currentIndex++;
        break;
        case 46:
            currentLexeme = currentLexeme + character;
            column++;
            currentIndex++;
            entireNumber = false;
            floatingNumber = true; 
            currentState = "q3";
        break;
        default:
            lexemes.push(currentLexeme);
            tokens.push(tokenEntireNumber);
            this.saveRowsAndColumns();
            entireNumber = false;                
        break;                                        
    } 
}

/*
Analisis del token Numero Flotante
*/
function analyzeFloatingNumber(codeAscii, character){
    switch(codeAscii){
        case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57: 
            if(currentState === "q3"){
                currentState = "q4";
            }
            currentLexeme = currentLexeme + character;
            column++;
            currentIndex++;
        break;
        default:
            if(currentState === "q3"){
                lexemes.push(currentLexeme.replace(".", ""));
                tokens.push(tokenEntireNumber);
                column--;
                this.saveRowsAndColumns();
                floatingNumber = false;
                error = true;

                currentIndex--;
            }
            else{
                lexemes.push(currentLexeme);
                tokens.push(tokenFloatingNumber);
                this.saveRowsAndColumns();
                floatingNumber = false;
            }            
        break;                                        
    } 
}

/*
Analisis de tokens Identificador, Boolean, Palabra Reservada
*/
function analyzeIdentifier(codeAscii, character){
    switch(codeAscii){
        case 65: case 66: case 67: case 68: case 69: case 70: case 71: case 72: case 73: case 74: case 75: case 76: case 77: case 78: case 79: case 80:  
        case 81: case 82:  case 83: case 84: case 85: case 86: case 87: case 88: case 89: case 90: 
        case 97: case 98: case 99: case 100: case 101: case 102: case 103: case 104: case 105: case 106: case 107: case 108: case 109: case 110: case 111: 
        case 112: case 113:  case 114: case 115: case 116: case 117: case 118: case 119: case 120: case 121: case 122:  
        case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
            currentLexeme = currentLexeme + character;
            column++;
            currentIndex++;   
        break;    
        default:
            if(listReservedWords.includes(currentLexeme)){
                tokens.push(currentLexeme);
            }
            else if(listBooleans.includes(currentLexeme)){
                tokens.push(tokenBoolean);
            }
            else{
                tokens.push(tokenIdentifier);
            }
            lexemes.push(currentLexeme);
            this.saveRowsAndColumns();
            identifier = false;
        break;   
    }
}

/*
Analisis del token Caracter
*/
function analyzeCharacter(codeAscii, textCharacter){
    switch(codeAscii){
        case 39:
            if(currentState === "q0"){
                currentState = "q1";
                currentLexeme = currentLexeme + textCharacter;
                column++;
                currentIndex++;
            }   
            else if(currentState === "q2"){
                currentLexeme = currentLexeme + textCharacter;
                lexemes.push(currentLexeme);
                tokens.push(tokenCharacter);
                column++;
                this.saveRowsAndColumns();
                character = false;
                currentIndex++;          
            }
            else if(currentState === "q4" || currentState === "q1"){
                currentLexeme = currentLexeme + textCharacter;
                errorLexemes.push(currentLexeme);
                errorTokens.push(tokenError);  
                column++;
                this.saveRowsAndColumnsError(); 
                character = false;
                currentIndex++;
                showErrorList = true;
            }
        break;         
        case 48: case 49: case 50: case 51: case 52: case 53: case 54: case 55: case 56: case 57:
            currentState = "q4";
            currentLexeme = currentLexeme + textCharacter;
            currentIndex++;    
            column++;
        break; 
        case 32:
            errorLexemes.push(currentLexeme);
            errorTokens.push(tokenError);  
            column++;
            this.saveRowsAndColumnsError(); 
            character = false;
            currentIndex++;
            showErrorList = true;
        break;
        default:
            if(currentState === "q1"){
                currentState = "q2";
                currentLexeme = currentLexeme + textCharacter;
                currentIndex++;
                column++;
            } 
            else{
                currentState = "q4";
                currentLexeme = currentLexeme + textCharacter;
                currentIndex++; 
                column++;
            }
        break;                                        
    } 
}   

//Funcion encargada de almacenar la fila y la columna actual.
function saveRowsAndColumns(){
        lexemeRows.push(row);
        lexemeColumns.push(column);
}

//Funcion encargada de almacenar la fila y la columna actual de los errores.                                                                                                                                                                                                                                                                                    //Funcion encargada de almacenar la fila y la columna actual.
function saveRowsAndColumnsError(){
        errorRows.push(row);
        errorColumns.push(column);
}



