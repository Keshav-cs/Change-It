// no use
console.log("fordownsub");
let s = document.getElementById('show');
console.log(s);


// let body = document.getElementsByTagName('body');
// body[0].empty();

document.body.innerHTML = '<h4> Preferred Options are:</h4>';
document.body.innerHTML+= s.outerHTML;

let divs = document.getElementsByTagName('a');
for(onediv of divs)
{
	onediv.innerHTML = ">>Select<<";
}

