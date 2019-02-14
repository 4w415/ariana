import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import { QuestionnairsService } from './_services/questionnairs.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  okeys = Object.keys;
  selectedQS: any = {};
  loading: Boolean = true;
  interactionLogged: Boolean = false;
  interaction: Array<any> = new Array<any>();
  questionnaires: Array<any> = new Array<any>();
  constructor(private qsService: QuestionnairsService) {}

  ngOnInit() {
    this.qsService.getQuestionnaires().subscribe((response: any) => {
      this.questionnaires = response.results;
      this.loading = false;
      console.log(this.questionnaires);
    }, (error: any) => {
      console.error(error);
    });
  }

  ngAfterViewInit() {

    $('.messages').animate({ scrollTop: $(document).height() }, 'fast');

    $('#profile-img').click(function () {
      $('#status-options').toggleClass('active');
    });

    $('.expand-button').click(function () {
      $('#profile').toggleClass('expanded');
      $('#contacts').toggleClass('expanded');
    });

    $('#status-options ul li').click(function () {
      $('#profile-img').removeClass();
      $('#status-online').removeClass('active');
      $('#status-away').removeClass('active');
      $('#status-busy').removeClass('active');
      $('#status-offline').removeClass('active');
      $(this).addClass('active');

      if ($('#status-online').hasClass('active')) {
        $('#profile-img').addClass('online');
      } else if ($('#status-away').hasClass('active')) {
        $('#profile-img').addClass('away');
      } else if ($('#status-busy').hasClass('active')) {
        $('#profile-img').addClass('busy');
      } else if ($('#status-offline').hasClass('active')) {
        $('#profile-img').addClass('offline');
      } else {
        $('#profile-img').removeClass();
      }

      $('#status-options').removeClass('active');
    });

    function newMessage() {
      const message = $('.message-input input').val();
      if ($.trim(message) === '') {
        return false;
      }
      $('<li class="sent"><img src="http://emilcarlsson.se/assets/mikeross.png" alt="" /><p>' +
        message + '</p></li>').appendTo($('.messages ul'));
      $('.message-input input').val(null);
      $('.contact.active .preview').html('<span>You: </span>' + message);
      $('.messages').animate({ scrollTop: $(document).height() }, 'fast');
    }

    $('.submit').click(function () {
      newMessage();
    });

    $(window).on('keydown', function (event) {
      if (event.which === 13) {
        newMessage();
        return false;
      }
    });
  }

  askQuestion(token?: any) {

    this.loading = true;
    const promise = new Promise((resolve, reject) => {
      if (!token) {
        this.qsService.getQuestion(this.selectedQS.pk, token)
          .subscribe((response: any) => {
            this.selectedQS = response;
            resolve();
          }, (error: any) => {
            console.error(error);
          });

      } else {

        this.interaction.push({
          type: 'sent',
          text: this.selectedQS.qtree.answers[token],
          token: token
        });

        this.qsService.getQuestion(this.selectedQS.pk, token)
          .subscribe((response: any) => {
            this.selectedQS = response;
            resolve();
          }, (error: any) => {
            console.error(error);
          });
      }
    });

    promise.then(() => {

      this.loading = false;
      this.interaction.push({
        type: 'replies',
        text: this.selectedQS.qtree.question || this.selectedQS.qtree.statement
      });

      if (this.selectedQS.qtree.statement) {
        const pathTokens = [];
        for (const item of this.interaction) {
          pathTokens.push(item.token);
        }

        this.qsService.sendPath({
          'log': { 'qid': this.selectedQS.pk, 'path': pathTokens }
        }).subscribe((response: any) => {
          this.interactionLogged = true;
        }, (error: any) => { console.error(error);
        });
      }
    });
  }

  switchQS(questionnaire: any, force?: boolean) {
    if (force !== true && questionnaire.pk === this.selectedQS.pk) { return; }
    this.interaction = new Array<any>();
    this.selectedQS = questionnaire;
    this.interactionLogged = false;
    this.askQuestion();
  }
}
