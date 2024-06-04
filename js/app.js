const checkbox = document.querySelector("#checkbox");
const book_icon_logo = document.querySelector(".book-icon-logo")
const search_word_defintion = document.querySelector(".search-word-defintion");
const search_word_input = document.querySelector(".search-word-input");

const word = document.querySelector(".word");
const phonetic = document.querySelector(".phonetic");
const part_of_speech = document.querySelector(".part-of-speech");

const play_button_container = document.querySelector(".play-button-container");

const meaning1 = document.querySelector(".meaning1");
const meaning2 = document.querySelector(".meaning2");
const meaning3 = document.querySelector(".meaning3");

const synonym_name = document.querySelector(".synonym-name")

const another_part_of_speech = document.querySelector(".another-part-of-speech");

const another_meaning_container = document.querySelector(".another-meaning-container");
const another_part_of_speech_meaning = document.querySelector(".another-part-of-speech-meaning");
const another_part_of_speech_example = document.querySelector(".another-part-of-speech-example");

const external_link_container = document.querySelector(".external-link-container");

let searchedWord;
let wordAudio;

checkbox.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  book_icon_logo.classList.toggle("toggleBookIconLogo")
})


search_word_defintion.addEventListener("submit",(event)=>{
  searchedWord = search_word_input.value;
  word.textContent = search_word_input.value;

  phonetic.textContent = ""
  meaning1.textContent = "";
  meaning2.textContent = "";
  meaning3.textContent = "";
  synonym_name.textContent = "";
  another_part_of_speech.textContent = "";

  another_meaning_container.style.display = "block";

  async function getWordDefinition(word){
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    const defintion = await response.json();
    wordAudio = new Audio();

    if(defintion.title !== "No Definitions Found"){
      part_of_speech.textContent = defintion[0].meanings[0].partOfSpeech;
      if (defintion[0].meanings[0].definitions.length === 1){
        meaning3.style.display = "none";
        meaning2.style.display = "none";

        meaning1.textContent = defintion[0].meanings[0].definitions[0].definition;
      } else if(defintion[0].meanings[0].definitions.length >= 5){
        meaning1.style.display = "list-item";
        meaning2.style.display = "list-item";
        meaning3.style.display = "list-item";
  
        meaning1.textContent = defintion[0].meanings[0].definitions[3].definition;
        meaning2.textContent = defintion[0].meanings[0].definitions[4].definition;
        meaning3.textContent = defintion[0].meanings[0].definitions[5].definition;
      } else if(defintion[0].meanings[0].definitions.length <= 4){
        meaning1.style.display = "content";
        meaning2.style.display = "none";
        meaning3.style.display = "none"
        meaning1.textContent = defintion[0].meanings[0].definitions[1].definition;
        // meaning2.textContent = defintion[0].meanings[0].definitions[2].definition;
      }
  
      setTimeout(()=>{
        if(defintion[0].phonetics.length === 1){
          wordAudio = new Audio(defintion[0].phonetics[0].audio);
        }else{
            if(defintion[0].phonetics[1] !== undefined){
              if(defintion[0].phonetics[1].audio !== ''){
                wordAudio = new Audio(defintion[0].phonetics[1].audio);
              }
            }
        }

        if(defintion[0].phonetics[0] !== undefined){
          if(defintion[0].phonetics[0].text !== undefined){
            phonetic.textContent = defintion[0].phonetics[0].text;
            }else{
            phonetic.textContent = " ";
          }
        }

      },200)

      if(defintion[0].meanings[1] !== undefined){
        if(defintion[0].meanings[1].synonyms[0] !== undefined){
          synonym_name.textContent = defintion[0].meanings[1].synonyms[0];
        }else{
          if(defintion[0].meanings[0].synonyms[0] !== undefined){
             synonym_name.textContent = defintion[0].meanings[0].synonyms[0];
          }else{
            synonym_name.textContent = 'Synonym not found'
          }
        }
      }else{
        if(defintion[0].meanings[0].synonyms[0] !== undefined){
          synonym_name.textContent = defintion[0].meanings[0].synonyms[0];
        }else{
          synonym_name.textContent = 'Synonym not found in list'
        }
      }
    if(defintion.length > 1){
        another_part_of_speech.textContent = defintion[1].meanings[0].partOfSpeech;
        another_part_of_speech_meaning.textContent = defintion[1].meanings[0].definitions[0].definition;
        another_part_of_speech_example.textContent = defintion[1].meanings[0].definitions[0].example;
    }else{
        another_meaning_container.style.display = "none";
    }
    external_link_container.textContent = defintion[0].sourceUrls[0];
    external_link_container.setAttribute("href", defintion[0].sourceUrls[0])
    }else{
      console.log('Word not found')
    }
    }
    
  getWordDefinition(searchedWord);

  event.preventDefault('')
})


play_button_container.addEventListener("click", ()=>{
  if(wordAudio !== undefined && !DOMException){
      wordAudio.play();
  }else{
    console.log('No pronunciation')
  }
})
