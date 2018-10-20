
const Properties = require('./properties');
const Dialogs = require('./Dialogs');
// const { ActivityTypes } = require('botbuilder');

class MyBot extends Dialogs {
    /**
   *
   * @param {ConversationState, UserState} conversation state object
   */
    constructor(conversationState, userState) {
        super();
        this.conversationState = conversationState;
        this.userState = userState;

        this.dialogState = this.conversationState.createProperty(Properties.DIALOG_STATE_PROPERTY);
        this.userProfile = this.userState.createProperty(Properties.USER_PROFILE_PROPERTY);
        this.initiateDialogs(this.dialogState);
    }

    /**
   *
   * @param {TurnContext} on turn context object.
   */
    async onTurn(turnContext) {
        const dc = await this.dialogs.createContext(turnContext);
        await dc.continueDialog();
        if (!turnContext.responded) {
            const user = await this.userProfile.get(dc.context, {});
            if (user.job) {
                await dc.beginDialog(Properties.CANDIDATE_SUBMIT_SUCCESS);
            } else {
                await dc.beginDialog(Properties.WHO_ARE_YOU);
            }
        }
        // Save changes to the user state.
        await this.userState.saveChanges(turnContext);

        // End this turn by saving changes to the conversation state.
        await this.conversationState.saveChanges(turnContext);
    }
}

module.exports.MyBot = MyBot;
