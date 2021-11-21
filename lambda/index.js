const Alexa = require("ask-sdk-core");
const showMessage = require("./errorMessages");

var counter = 0;

// Launch intent that executes when the skill starts.

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput = showMessage.message.WELCOME_MESSAGE;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const GameIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "GameIntent"
    );
  },
  handle(handlerInput) {
    let speakOutput = "";
    let extraOutput = "";
    let isSessionEnd = false;
    const userAction =
      handlerInput.requestEnvelope.request.intent.slots.number.value;
    counter = counter + 2;

    if (
      isNaN(parseInt(userAction)) &&
      userAction !== "fizz" &&
      userAction !== "buzz" &&
      userAction !== "fizz buzz"
    ) {
      isSessionEnd = true;
      speakOutput += showMessage.errorMessages.STRING_MISMATCH;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else if (100 === counter) {
      isSessionEnd = true;
      speakOutput += showMessage.message.CONGRATULATIONS;
      extraOutput += showMessage.message.PLAY_AGAIN;
      counter = 0;
    } else if (userAction !== `${counter}` && parseInt(userAction) % 3 === 0) {
      isSessionEnd = true;
      speakOutput += `I’m sorry, the correct response was "${counter}". ${showMessage.errorMessages.LOOSE_GAME}`;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else if (parseInt(userAction) % 3 === 0) {
      isSessionEnd = true;
      speakOutput += `I’m sorry, the correct response was “fizz”. ${showMessage.errorMessages.LOOSE_GAME} `;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else if (userAction !== `${counter}` && parseInt(userAction) % 5 === 0) {
      isSessionEnd = true;
      speakOutput += `I’m sorry, the correct response was "${counter}". ${showMessage.errorMessages.LOOSE_GAME}`;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else if (parseInt(userAction) % 5 === 0) {
      isSessionEnd = true;
      speakOutput += `I’m sorry, the correct response was “buzz”. ${showMessage.errorMessages.LOOSE_GAME}`;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else if (userAction === "fizz") {
      if (counter % 3 !== 0) {
        isSessionEnd = true;
        speakOutput += `I’m sorry, the correct response was ${counter}. ${showMessage.errorMessages.LOOSE_GAME}`;
        extraOutput += showMessage.message.RESTART_MESSAGE;
        counter = 0;
      } else {
        speakOutput += speakOutputHandler();
      }
    } else if (userAction === "buzz") {
      if (counter % 5 !== 0) {
        isSessionEnd = true;
        speakOutput += `I’m sorry, the correct response was ${counter}. ${showMessage.errorMessages.LOOSE_GAME}`;
        extraOutput += showMessage.message.RESTART_MESSAGE;
        counter = 0;
      } else {
        speakOutput += speakOutputHandler();
      }
    } else if (userAction === "fizz buzz") {
      if (counter % 5 !== 0 && counter % 3 !== 0) {
        isSessionEnd = true;
        speakOutput += `I’m sorry, the correct response was ${counter}. ${showMessage.errorMessages.LOOSE_GAME}`;
        extraOutput += showMessage.message.RESTART_MESSAGE;
        counter = 0;
      } else if (counter % 5 !== 0) {
        isSessionEnd = true;
        speakOutput += `I’m sorry, the correct response was ${counter}. ${showMessage.errorMessages.LOOSE_GAME}`;
        extraOutput += showMessage.message.RESTART_MESSAGE;
        counter = 0;
      } else {
        speakOutput += speakOutputHandler();
      }
    } else if (userAction !== `${counter}`) {
      isSessionEnd = true;
      speakOutput += `I’m sorry, the correct response was "${counter}". ${showMessage.errorMessages.LOOSE_GAME}`;
      extraOutput += showMessage.message.RESTART_MESSAGE;
      counter = 0;
    } else {
      speakOutput += fizzOrBuzz(parseInt(userAction) + 1);
    }
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    attributes.lastResult = speakOutput;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    return handlerInput.responseBuilder
      .speak(speakOutput + extraOutput)
      .withShouldEndSession(isSessionEnd)
      .getResponse();
  },
};

// Determine the correct alexa's correct response when user says/ write "fizz", "buzz" or "fizz buzz".

function speakOutputHandler() {
  let speakOutput = "";
  if ((counter + 1) % 3 === 0 && (counter + 1) % 5 === 0) {
    speakOutput += `fizz buzz`;
  } else if ((counter + 1) % 3 === 0) {
    speakOutput += `fizz`;
  } else if ((counter + 1) % 5 === 0) {
    speakOutput += `buzz`;
  } else {
    speakOutput += `${counter + 1}`;
  }
  return speakOutput;
}

// Determine the correct alexa's fizz buzz response on given a number by user.

function fizzOrBuzz(num) {
  if (num % 3 === 0 && num % 5 !== 0) return "fizz";
  if (num % 5 === 0 && num % 3 !== 0) return "buzz";
  if (num % 3 === 0 && num % 5 === 0) return "fizz buzz";
  return num;
}

const RepeatIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.RepeatIntent"
    );
  },
  handle(handlerInput) {
    const attributes = handlerInput.attributesManager.getSessionAttributes();
    let speakOutput = "";
    if (attributes.lastResult) {
      speakOutput += `I said ${attributes.lastResult}.`;
    } else {
      speakOutput += `I dont remember, what I said.`;
    }
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};
// Help intent to provide more information about the game.

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    counter = 0;
    const speakOutput = showMessage.message.HELP;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

// Stop and Cancel intent to stop the game and end session.

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        "AMAZON.CancelIntent" ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
          "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    counter = 0;
    const speakOutput = showMessage.message.GOODBYE_MESSAGE;
    return handlerInput.responseBuilder.speak(speakOutput).getResponse();
  },
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    GameIntentHandler,
    HelpIntentHandler,
    RepeatIntentHandler,
    CancelAndStopIntentHandler
  )
  .withCustomUserAgent("sample/hello-world/v1.2")
  .lambda();
