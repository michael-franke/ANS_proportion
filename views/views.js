var intro = {
    name: 'intro',
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for your help! In this experiment, we will show you pictures with red and black dots. Your task is to estimate the percentage of red dots in each picture. <strong>You are not required to count the dots! Just give a reasonable estimate!</strong> We start with a few practice rounds!",
    // introduction's slide proceeding button text
    "buttonText": "Let's practice!",
    // render function renders the view
    render: function() {

        viewTemplate = $('#intro-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    // for how many trials should this view be repeated?
    trials: 1
};

var instructions = {
    name: 'instructions',
    // instruction's title
    "title": "Instructions",
    // instruction's text
    "text": "Adjust the slider to give an estimate of the proportion of red dots in each picture. If there are no red dots, the proportion is 0%. If half of the dots are red, the proportion is 50%. If all of the dots are red, the proportion is 100%. If you are not sure what the correct proportion is, just give us your best guess.",
    // instuction's slide proceeding button text
    "buttonText": "Start practice rounds!",
    render: function() {

        viewTemplate = $("#instructions-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var practice = {
    name: 'practice',
    "title": "Practice",
    // render function renders the view
    render: function (CT) {

        viewTemplate = $("#practice-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
        title: this.title,
        question: "What is the percentage of red dots in this picture?",
        picture: exp.trial_info.practice_trials[CT].picture,
        questionRightPart: exp.trial_info.practice_trials[CT].questionRightPart,
        questionRightPart2: exp.trial_info.practice_trials[CT].questionRightPart2
        }));
        startingTime = Date.now();
        var next = $('#next');
		var response = $('#response');
		 // checks if the slider has been changed
        response.on('change', function() {
            next.removeClass('nodisplay');
			$('output')[0].innerHTML = _.round(response.val()/432*100, 2);
        });
        response.on('click', function() {
            next.removeClass('nodisplay');
			$('output')[0].innerHTML = _.round(response.val()/432*100, 2);
        });
        next.on('click', function() {
            RT = Date.now() - startingTime; // measure RT before anything else
            trial_data = {
                trial_type: "practice",
                trial_number: CT+1,
                picture: exp.trial_info.practice_trials[CT].picture,
                dots_number: exp.trial_info.practice_trials[CT].picture.slice(7, -14),
				rating_slider: response.val(),
                RT: RT
            };
            exp.trial_data.push(trial_data);
            exp.findNextView();
        });

//        return view;
    },
    trials: 2
};

var beginMainExp = {
    name: 'beginMainExp',
    "text": "Alright. Let's proceed to the main experiment. It's the same as the practice trials. There will be a total of 24 pictures. Please stay focused and give us your best guess for each picture!",
    // render function renders the view
    render: function() {

        viewTemplate = $('#begin-exp-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: this.text
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
};

var main = {
    name: 'main',
    // render function renders the view
    render : function(CT) {

        // fill variables in view-template
        var viewTemplate = $('#main-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            question: "What is the percentage of red dots in this picture?",
            picture:  exp.trial_info.main_trials[CT].picture,
        }));

//        // update the progress bar based on how many trials there are in this round
//        var filled = exp.currentTrialInViewCounter * (180 / exp.views_seq[exp.currentViewCounter].trials);
//        $('#filled').css('width', filled);

        // event listener for buttons; when an input is selected, the response
        // and additional information are stored in exp.trial_info
        var next = $('#next');
		var response = $('#response');
		 // checks if the slider has been changed
        response.on('change', function() {
            next.removeClass('nodisplay');
			$('output')[0].innerHTML = _.round(response.val()/432*100, 2);
        });
        response.on('click', function() {
            next.removeClass('nodisplay');
			$('output')[0].innerHTML = _.round(response.val()/432*100, 2);
        });
        next.on('click', function() {
            RT = Date.now() - startingTime; // measure RT before anything else
            trial_data = {
                trial_type: "main",
                trial_number: CT+1,
                picture: exp.trial_info.main_trials[CT].picture,
                dots_number: exp.trial_info.main_trials[CT].picture.slice(7, -14),
				rating_slider: response.val(),
                RT: RT
            };
            exp.trial_data.push(trial_data);
            exp.findNextView();
        });
        startingTime = Date.now();
    },

	trials : 24
};

var postTest = {
    "title": "Additional Info",
    "text": "Answering the following questions is optional, but will help us understand your answers.",
    "buttonText": "Continue",
    render : function() {
        var view = {};
        view.name = 'postTest';
        view.template = $('#post-test-view').html();
        $('#main').html(Mustache.render(view.template, {
            title: this.title,
            text: this.text,
            buttonText: this.buttonText
        }));

        $('#next').on('click', function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.age = $('#age').val();
            exp.global_data.gender = $('#gender').val();
            exp.global_data.education = $('#education').val();
            exp.global_data.languages = $('#languages').val();
            exp.global_data.comments = $('#comments').val().trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent = (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        })

        return view;
    },
    trials: 1
};

var thanks = {
    name: 'thanks',
    "message": "Thank you for taking part in this experiment!",
    render: function() {

        viewTemplate = $('#thanks-view').html();

        // what is seen on the screen depends on the used deploy method
		//    normally, you do not need to modify this
        if ((config_deploy.is_MTurk) || (config_deploy.deployMethod === 'directLink')) {
            // updates the fields in the hidden form with info for the MTurk's server
            $('#main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
            }));
        } else if (config_deploy.deployMethod === 'Prolific') {
            var prolificURL = 'https://prolific.ac/submissions/complete?cc=' + config_deploy.prolificCode;

            $('main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
                extraMessage: "Please press the button below<br />" + '<a href=' + prolificURL +  ' class="prolific-url">Finished!</a>'
            }));
        } else if (config_deploy.deployMethod === 'debug') {
            $('main').html(Mustache.render(viewTemplate, {}));
        } else {
            console.log('no such config_deploy.deployMethod');
        }

        exp.submit();

    },
    trials: 1
};
