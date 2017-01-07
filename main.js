var osmosis = require('osmosis');
var _ = require('lodash')
var clusterMaker = require('clusters');

//number of clusters, defaults to undefined
clusterMaker.k(2);

//number of iterations (higher number gives more time to converge), defaults to 1000
clusterMaker.iterations(750);


var cards = [
    "abunas léonins",
    "alhammarret, grand arbitre",
    "alhammarret, grand arbitre",
    "ange de l'égide",
    "ange lumineux",
    "annelures d'éclair",
    "archifielleux de la dépravation",
    "augure de lumengrid",
    "augure de vapeur",
    "autel des ombres",
    "balance du sacrifice",
    "bâton de protée",
    "bon de l'évolution",
    "bosh, golem de fer",
    "bougies de leng",
    "bourdonnement du radix",
    "brumes nécrogènes",
    "butin du caveau",
    "carapace fortifiée errante",
    "cascade temporelle",
    "changedragon",
    "châtieur loxodon",
    "châtiment des ancêtres",
    "cheval de cauchemar",
    "cheval de cauchemar",
    "clockwork dragon",
    "collier porte-malheur",
    "confusion in the ranks",
    "cuve d'évolution",
    "danseforme",
    "dent et ongle",
    "destrier des enfers de la foire",
    "dévastateur des terres nessiannes",
    "dévotion grandissante",
    "djinn âmelame",
    "djinn mahâmot",
    "dragon fondeur de butin",
    "dragon shivân",
    "elémental de tornade",
    "elémental de vif-argent",
    "engeance des étoiles",
    "essaim vivant",
    "etendard-soleil léonin",
    "faux des misérables",
    "fontaine de vif-argent",
    "forge-acier auriok",
    "fouet de cauchemar",
    "frappeur à l'arc",
    "garant de la paix loxodon",
    "gargouille d'annulpierre",
    "glissa cherchesoleil",
    "guivre cendrée à plaques",
    "hélice tisse-sort",
    "hystérie collective",
    "incubateur myr",
    "indestructibilité",
    "intrusion psychique",
    "irréguliers de kytheon",
    "isperia l'impénétrable",
    "kanzashi orné",
    "l'innommable",
    "lentille extraplanaire",
    "lien céleste",
    "lisseur",
    "mage de l'arène",
    "mage de la jarre",
    "maîtresse des batailles vulshoke",
    "marée solaire",
    "matrice d'amortissement",
    "mégatog",
    "moissonneur de mephidross",
    "myr de magnétite",
    "nefarox, suzerain de grixis",
    "obscure prétention",
    "oeil de l'esprit",
    "oeuf de rukh",
    "omnibien",
    "orage de probabilités",
    "orbe mesmérique",
    "pari ardent",
    "patron des nezumi",
    "pendule du menteur",
    "pentavus",
    "perdus dans les bois",
    "pia et kiran nalaàr",
    "piétineur terrestre",
    "pique du chanterune",
    "plaque empyrée",
    "porte vers l'aether",
    "pouce de krark",
    "pourfendeur de monde",
    "promesse de pouvoir",
    "proportions épiques",
    "pulsion prédatoire",
    "racine de la filandre",
    "rassemblement de nomades",
    "régente rase-rival",
    "répliquant",
    "rule of law",
    "sanctuaire de jace",
    "secoureur des anneaux du mage",
    "seigneur démon de cendregueule",
    "sinistre forêt sauvage",
    "sinistre rappel",
    "sonde psychogénique",
    "souverain du levant",
    "surveillant de la grille",
    "tamiseur de temps",
    "tentation de l'immortalité",
    "teysa, plénipotentiaire de fantômes",
    "tibor et lumia",
    "titan du feu éternel",
    "torchelin",
    "tour des champions",
    "tour des éons",
    "tour des fortunes",
    "tour des murmures",
    "trésor au rébut",
    "triskèle",
    "trône draconique de tarkir",
    "urne à scintimite",
    "vengeance en chasse",
    "vermiculos",
    "vorrac aux sabots de cuivre"
]

mPrices = function(str){
    return str
        .replace("\\n","\n")
        .replace(",",".")
        .match(/([\d\., ]+€)/g)
}
function findPrice(ccc){
    var card = ccc[0];
    var tail = ccc.slice(1);
    // console.log(card,"-----------------------")
    // console.log(escape(card.replace(" ","+")))
    osmosis
        .get(
            'http://www.magicbazar.fr/recherche/search.php',
            {s: card
                .replace("é","e")
                .replace("ê","e")
                .replace("è","e")
                .replace("à","a")
                .replace("â","a")
            }
        )
        .select('.card_table, .stock')
        .set('prix')
        .data(function(listing) {
            var prices = mPrices(listing.prix).map(function(e){
                return parseFloat(e)//.slice(0,-1).replace(".",","))
            }).sort()
            //data from which to identify clusters, defaults to []
            clusterMaker.data(prices.map(function(e){return [e,0]}))
            var centroids = clusterMaker
                .clusters()
                .map(function(e){return e.centroid[0]})
            var finalPrice = centroids.sort()[0]

            // console.log("clusterMaker =========> ", centroids);

            // var averagePrice = _.mean(prices)
            var averagePrice = (""+finalPrice)
                .replace(".",",")
                .slice(0,5)
            // console.log(listing)
            console.log(averagePrice, "\t", card) //, "\t", ,prices)
            // console.log('prix1', listing.prix1)
            // console.log('prix2', listing.prix2)
        })
        // .log(console.log)
        // .error(console.log)
        // .debug(console.log)
        .done(function(){
            if (tail.length > 0) {
                // console.log("next is:",tail[0])
                findPrice(tail)
            }
        })
}

console.log("start")
findPrice(cards)
// findPrice(["ange lumineux"])
console.log("end")
