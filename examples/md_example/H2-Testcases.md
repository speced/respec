# Testcases

Hieronder de testcases

# Titels

Een hoofdstuk titel maak je met één #

```
# Titel-1
```
voorbeeld

## Titel-2

Een Paragraaf van niveau 2 maak je met twee ##
```
## Titel-2
```
voorbeeld

### Titel-3

Een Paragraaf van niveau 3 maak je met drie ###

```
### Titel-3
```
voorbeeld

#### Titel-4

Een Paragraaf van niveau 4 maak je met vier ####

```
#### Titel-4
```
voorbeeld

##### Titel-5

Een Paragraaf van niveau 5 maak je met vijf #####

```
##### Titel-5
```
voorbeeld

###### Titel-6

Een Paragraaf van niveau 6 maak je met zes ######

```
### Titel-6
```
voorbeeld


## Tekst benadrukken

```
*Deze tekst staat cursief*
```
*Deze tekst staat cursief*

```
_Deze tekst staat ook cursief_
```
_Deze tekst staat ook cursief_

```
*Deze tekst is vetgedrukt*
```
*Deze tekst is vetgedrukt*

```
__Deze tekst is ook vetgedrukt__
```
__Deze tekst is ook vetgedrukt__

```
*Je **mag** dit ook combineren* 
```

*Je **mag** dit ook combineren*  

## Blok Quotes

```
Dr. Green zei:
> Het was ...
> Met de Kandelaar
> in
> de Bibliotheek.
```

Dr. Green zei:
> Het was ...
> Met de Kandelaar
> in
> de Bibliotheek.

## Lijsten

### Ongesorteerd

```
* Keuken
* Hal
* Bibiotheek
 * Kandelaar
 * Touw
```

* Keuken
* Hal
* Bibiotheek
 * Kandelaar
 * Touw

### Gesorteerd

```
1. Keuken
2. Hal
3. Bibiotheek
 * Kandelaar
 * Touw
```

1. Keuken
2. Hal
3. Bibiotheek
 * Kandelaar
 * Touw

### Taken/vinklijst

```
- [x] Gedaan
- [ ] Te doen
- [x] @mentions, #refs, [links](),**formatting**, en <del>tags</del> worden ondersteund
```
- [x] Gedaan
- [ ] Te doen
- [x] @mentions, #refs, [links](),**formats**, en <del>tags</del> worden ondersteund


## Tabellen

Tabellen maak je met **|** en **-**

### Een tabel met **Vette** kopregels

| *RijKop*   | *Kolomkop-1*   | **Kolomkop-2** | **Kolomkop-3** | **Kolomkop-4** |
|------------|----------------|----------------|----------------|----------------|
| Rij-1      | Waarde         | Waarde         | Waarde         | Waarde         |
| Rij-2      | Waarde         | Waarde         | Waarde         | Waarde         |
| Rij-3      | Waarde         | Waarde         | Waarde         | Waarde         |
| Rij-4      | Waarde         | Waarde         | Waarde         | Waarde         |
| Rij-5      | Waarde         | Waarde         | Waarde         | Waarde         |


### Een tabel met **Lege** cellen

| *RijKop*   | *Kolomkop-1*   | **Kolomkop-2** | **Kolomkop-3** | **Kolomkop-4** |                   
|------------|----------------|----------------|----------------|----------------|
| Rij-1      |                | Waarde         | Waarde         | Waarde         |
| Rij-2      | Waarde         |                | Waarde         | Waarde         |
| Rij-3      | Waarde         | Waarde         | Waarde         | Waarde         |
| Rij-4      | Waarde         | Waarde         | Waarde         |                |
| Rij-5      | Waarde         | Waarde         | Waarde         | Waarde         |



## Voorbeelden/Examples

In je document maak je gebruikl van voorbeelden, dat doe je zo:
```
<div class='example'>
    <span>Het was Colonel Mustard</span>
</div>
```
en dat geeft dit resultaat:
<div class='example'>
    <span>Het was Colonel Mustard</span>
</div>


## (Voet)noten

### Met eigen HTML

```
Testen van een Verwijzing<a href="#fn1-1" id="fn1-1ref"><sup>1-1</sup></a> die in een tekst is  
opgenomen, en oh, ook nog een tweede<a href="#fn1-2" id="fn1-2ref"><sup>1-2</sup></a> om zeker
te weten dat het werkt.
```
Testen van een Verwijzing<a href="#fn1-1" id="fn1-1ref"><sup>1-1</sup></a> die in een tekst is  
opgenomen, en oh, ook nog een tweede<a href="#fn1-2" id="fn1-2ref"><sup>1-2</sup></a> om zeker
te weten dat het werkt.

**En de noten zelf**

```
<a id="fn1-1" href="#fn1-1ref"><sup>1-1</sup></a>: Verwijzing tekst 1, klik erop om terug te keren  
<a id="fn1-2" href="#fn1-2ref"><sup>1-2</sup></a>: Verwijzing tekst 2, klik erop om terug te keren
```
<a id="fn1-1" href="#fn1-1ref"><sup>1-1</sup></a>: Verwijzing tekst 1, klik erop om terug te keren  
<a id="fn1-2" href="#fn1-2ref"><sup>1-2</sup></a>: Verwijzing tekst 2, klik erop om terug te keren

### Standaard Respec 

Respec kent een mooiaantal e manier om een stuk tekst in een noot te zetten:
```
<div class='note'>
    <span>Het was Reverend Green in de Hal</span>
</div>
```
geeft dit resultaat:

<div class='note'>
    <span>Het was Reverend Green in de Hal</span>
</div>

Of (Let op dat de tekst in de note nu met hoofdletters is geschreven)
```
<div class='note'>
    <div class='note-title'>
        <span>Het was Miss Scarlet in de Keuken<span>
    </div>
</div>
```
<div class='note'>
    <div class='note-title'>
        <span>Het was Miss Scarlet in de Keuken<span>
    </div>
</div>

### met class='note' in aside of span

aside geeft een separaat tekstblok
```
<aside class='note'>
    Het was Dr. Orchid, hij is de dader....
</aside>  
```
geeft:
<aside class='note'>
    Het was Dr. Orchid, hij is de dader....
</aside>  

terwijl span een highlighted tekst in een andere tekst geeft   

```
Een highlight in de tekst <span class='note'>Dr. Orchid</span> zie je hier.
```
Een highlight in de tekst <span class='note'>Dr. Orchid</span> zie je hier.


## Verwijzigingen

### kruisverwijzing
```
Ik heb hier een tekstverwijzing [^1] naar daar staan.
```
Ik heb hier een tekstverwijzing [^1] naar daar staan.

bla bla bla 
bla bla bla
bla bla bla

en de verwijzing zelf:
```
[^1]: waar is daar? nou: hier.
```
[^1]: waar is daar? nou: hier.

### verwijzing naar hoofdstuk of paragraaf
```
Een interne verwijzing naar een hoofdstuk doe je [zo](#titels)
```
Een interne verwijzing naar bijvoorbeeld *Titels* doe je [zo](#titels)

## Code blokken

Soms wil je stukjes code opnemen in je document, dan zet je er drie qotes voor en drie achter.
Let erop dat je de juiste ` gebruikt. Het is die onder de ~.


<pre>```
function WhoDunnit() 
{
    console.log("It was Dr. Green’, in the Library");
}
```
</pre>

wordt 
```
function WhoDunnit() 
{
    console.log("It was Dr. Green’, in the Library");
}
```

## Afbeeldingen

```
![Dit is geen willekeurige afbeelding](media/cluedo.jpg)
```
![Dit is geen willekeurige afbeelding](media/cluedo.jpg)

## Hyperlinks
```
hyperlinks werken vanzelf, bijvoorbeeld www.geonovum.nl
```
hyperlinks werken vanzelf, bijvoorbeeld www.geonovum.nl

## Referenties
```
Een paar verwijzingen naar de localBiblio staan hier [[GIF]]  
zie vooral ook [[KANDELAAR]] voor het alternatief gebruik van Kandelaars
```
Een paar verwijzingen naar de localBiblio staan hier [[GIF]]  
zie vooral ook [[KANDELAAR]] voor het alternatief gebruik van Kandelaars
