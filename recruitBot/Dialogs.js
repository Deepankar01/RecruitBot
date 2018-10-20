const messages = require('./staticData/messages');
const jobs = require('./staticData/jobs');
const Properties = require('./properties'); ;
const { ChoicePrompt, DialogSet, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

class Dialogs {
    initiateDialogs(dialogState) {
        this.dialogs = new DialogSet(dialogState);

        this.dialogs.add(new TextPrompt(Properties.GREET_CANDIDATE));
        this.dialogs.add(new ChoicePrompt(Properties.SHOW_JOBS));

        // Create a dialog that asks the user for their name.
        this.dialogs.add(new WaterfallDialog(Properties.WHO_ARE_YOU, [
            this.greetCandidate.bind(this),
            this.captureName.bind(this),
            this.showOptionsForJob.bind(this),
            this.captureJobs.bind(this)
        ]));

        // Create a dialog that displays a user name after it has been collected.
        this.dialogs.add(new WaterfallDialog(Properties.CANDIDATE_SUBMIT_SUCCESS, [
            this.displayProfile.bind(this)
        ]));
    }
    async greetCandidate(step) {
        return await step.prompt(Properties.GREET_CANDIDATE, messages.greet);
    }

    async showOptionsForJob(step) {
        return await step.prompt(Properties.SHOW_JOBS, 'For which job you want to apply?', jobs.map((job) => job.name));
    }

    async captureName(step) {
        const user = await this.userProfile.get(step.context, {});
        if (step.result) {
            user.name = step.result;
        }
        await this.userProfile.set(step.context, user);
        return await step.continueDialog();
    }

    async captureJobs(step) {
        const user = await this.userProfile.get(step.context, {});
        if (step.result.index > -1) {
            user.job = jobs[step.result.index];
            await this.userProfile.set(step.context, user);
        }
        return await step.endDialog();
    }

    async displayProfile(step) {
        const user = await this.userProfile.get(step.context, {});
        await step.context.sendActivity(`Your name is ${ user.name } and you did not share your age.`);
        return await step.endDialog();
    }
}

module.exports = Dialogs;
