import {Component, OnChanges, OnInit} from '@angular/core';
import {NPCState} from '../npc-states-widget.component';
import * as settingsJson from '../../../../../assets/npc-settings.json';

@Component({
	selector: 'app-npc-states',
	templateUrl: './npc-states.component.html',
	styleUrls: ['./npc-states.component.scss', '../../widget.scss'],
})
export class NpcStatesComponent implements OnInit, OnChanges {
	
	states: NPCState[] = [
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': '      ',
			'config': 'normal',
			'event': {
				'quest': [
					{
						'name': {
							'en_US': 'Humble Helper',
							'langUid': 214,
							'zh_CN': '谦卑的助手',
							'de_DE': 'Bescheidener Betreuer',
							'fr_FR': '',
							'ja_JP': '控えめなお手伝い',
							'ko_KR': '미천한 도우미'
						},
						'side': 'LEFT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'side': 'RIGHT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'main.lea',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'message': {
							'de_DE': 'Hi!',
							'en_US': 'Hi!',
							'langUid': 6,
							'fr_FR': '',
							'zh_CN': '你好！',
							'ja_JP': 'やぁ！',
							'ko_KR': '안녕!'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'PROUD'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': 'Hello Ms. \\v[lore.title.seeker]!\\. So great to see you here on \\v[lore.title.planet].',
							'de_DE': 'Ich grüße Sie, Frau \\v[lore.title.seeker]!\\. Schön, Sie hier auf \\v[lore.title.planet] zu sehen.',
							'fr_FR': 'fr_FR',
							'zh_CN': '你好，\\v[lore.title.seeker]小姐！\\.在沙德隆上见到你实在太好了。',
							'ja_JP': 'こんにちは、\\v[lore.title.seeker]さん！\\.ここ\\v[lore.title.planet]の地で会えて嬉しいです。',
							'langUid': 7,
							'ko_KR': '안녕하세요, \\v[lore.title.seeker] 양!\\. 이곳 \\v[lore.title.planet]에서 보다니 참 좋군요.'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'de_DE': '...',
							'en_US': '...',
							'langUid': 9,
							'fr_FR': '',
							'zh_CN': '…',
							'ja_JP': '…',
							'ko_KR': '...'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'SURPRISED_TOWARD'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': 'As a humble part of our endeavor here I am trying my best to aid Seekers.',
							'de_DE': 'Als bescheidener Teil unser aller Bestreben hier versuche ich mein Bestes, den Seekern zu helfen.',
							'fr_FR': 'fr_FR',
							'langUid': 10,
							'zh_CN': '我们一直在尽最大努力援助探索者们。',
							'ja_JP': 'ささやかながら探索者のみなさんの力になれるよう、私なりに全力を尽くしています。',
							'ko_KR': '우리의 미천한 노력 중 하나로 시커에게 최대한 도움을 주려고 합니다.'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'de_DE': '...',
							'en_US': '...',
							'langUid': 11,
							'fr_FR': '',
							'zh_CN': '…',
							'ja_JP': '…',
							'ko_KR': '...'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'ASTONISHED'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': 'But, my skills are just not on the same level as yours are.',
							'de_DE': 'Leider sind meine Fähigkeiten noch nicht auf demselben Level wie Ihre.',
							'fr_FR': 'fr_FR',
							'langUid': 12,
							'zh_CN': '可是，我的能力跟你们差距有点大。',
							'ja_JP': 'しかし、私のスキルでは皆さんのレベルには及ばないのです。',
							'ko_KR': '하지만 제 능력은 당신에 비해 보잘것 없습니다.'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': 'Might I ask you to help me out, dear \\v[lore.title.seeker]?',
							'de_DE': 'Dürfte ich Sie höflich darum bitten, mir etwas auszuhelfen, werter \\v[lore.title.seeker]?',
							'fr_FR': 'fr_FR',
							'zh_CN': '亲爱的探索者，能请你帮我一把吗？',
							'ja_JP': 'もしよろしければ手伝っていただいてもいいですか、\\v[lore.title.seeker]さん？',
							'langUid': 14,
							'ko_KR': '\\v[lore.title.seeker]의 도움이 필요할 수도 있어요.'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': '...!',
							'de_DE': '...!',
							'fr_FR': 'fr_FR',
							'langUid': 42,
							'zh_CN': '…？',
							'ja_JP': '…！',
							'ko_KR': '...!'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'ASTONISHED'
						},
						'type': 'SHOW_MSG'
					},
					{
						'activate': false,
						'acceptVar': 'tmp.accept',
						'type': 'OPEN_QUEST_DIALOG',
						'quest': 'my-first-quest',
						'accepted': [
							{
								'type': 'SET_MSG_EXPRESSION',
								'person': {
									'person': 'main.lea',
									'expression': 'PROUD'
								}
							},
							{
								'message': {
									'en_US': 'Superb!\\. Come back to me when you\'ve defeated the \\v[combat.name.hedgehog]s.',
									'de_DE': 'Hervorragend! Kommen Sie noch mal wieder, wenn Sie die \\v[combat.name.hedgehog] besiegt haben.',
									'fr_FR': 'fr_FR',
									'zh_CN': '太好了！麻烦你击败\\v[combat.name.hedgehog]后回来告诉我一声。',
									'ja_JP': 'それはよかった！\\.では、\\v[combat.name.hedgehog]たちをやっつけたら戻ってきてください。<<A<<[CHANGED 2017/08/03]',
									'langUid': 40,
									'ko_KR': '훌륭하군요!\\. \\v[combat.name.hedgehog]를 처치한 뒤 다시 저를 찾아오세요.'
								},
								'autoContinue': false,
								'person': {
									'person': 'rookie-harbor.man-big-black',
									'expression': 'DEFAULT'
								},
								'type': 'SHOW_MSG'
							}
						],
						'declined': [
							{
								'type': 'SET_MSG_EXPRESSION',
								'person': {
									'person': 'main.lea',
									'expression': 'NERVOUS'
								}
							},
							{
								'message': {
									'en_US': 'Oh, okay!\\. No Problem Ms. \\v[lore.title.seeker].\\. Please come back if you changed your mind.',
									'de_DE': 'Oh, na ja!\\. Kein Problem, Frau \\v[lore.title.seeker].\\. Besuchen Sie mich einfach wieder, wenn Sie es sich anders überlegt haben.',
									'fr_FR': 'fr_FR',
									'zh_CN': '哦，好的！没问题，\\v[lore.title.seeker]\\小姐。如果你改变主意的话，请回来找我。',
									'ja_JP': 'ああ、いいんですよ！\\.お気になさらないでください、\\v[lore.title.seeker]さん。\\.気が変わったら戻ってきてくださいね。',
									'langUid': 41,
									'ko_KR': '알겠습니다!\\. 문제없어요, \\v[lore.title.seeker] 양.\\. 마음이 바뀌면 다시 절 찾아주세요.'
								},
								'autoContinue': false,
								'person': {
									'person': 'rookie-harbor.man-big-black',
									'expression': 'DEFAULT'
								},
								'type': 'SHOW_MSG'
							}
						]
					}
				]
			}
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest.started',
			'config': 'normal',
			'event': [
				{
					'name': {
						'en_US': 'Humble Helper',
						'langUid': 215,
						'zh_CN': '谦卑的助手',
						'de_DE': 'Bescheidener Betreuer',
						'fr_FR': '',
						'ja_JP': '控えめなお手伝い',
						'ko_KR': '미천한 도우미'
					},
					'side': 'LEFT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'side': 'RIGHT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'main.lea',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'message': {
						'de_DE': 'Hi!',
						'en_US': 'Hi!',
						'langUid': 25,
						'fr_FR': '',
						'zh_CN': '你好！',
						'ja_JP': 'やぁ！',
						'ko_KR': '안녕!'
					},
					'autoContinue': false,
					'person': {
						'person': 'main.lea',
						'expression': 'PROUD'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'Hello Ms. \\v[lore.title.seeker]!\\. Enjoying your Journey?',
						'de_DE': 'Hallo, Frau \\v[lore.title.seeker]!\\. Genießen Sie Ihre abenteuerliche Reise?',
						'fr_FR': 'fr_FR',
						'zh_CN': '你好，\\v[lore.title.seeker]小姐！\\.旅途还愉快吗？',
						'ja_JP': 'こんにちは、\\v[lore.title.seeker]さん！\\.旅路は楽しまれていますか？',
						'langUid': 26,
						'ko_KR': '안녕하세요, \\v[lore.title.seeker] 양!\\. 여정은 어땠나요?'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'de_DE': '...',
						'en_US': '...',
						'langUid': 27,
						'fr_FR': '',
						'zh_CN': '…',
						'ja_JP': '…',
						'ko_KR': '...'
					},
					'autoContinue': false,
					'person': {
						'person': 'main.lea',
						'expression': 'NOD'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'Of course you do, haha!\\. Oh to be young again!',
						'de_DE': 'Natürlich tun Sie das, haha!\\. Ach Mann, noch einmal jung sein!<<C<<LR: "Oh, noch einmal jung zu sein!"',
						'fr_FR': 'fr_FR',
						'langUid': 28,
						'zh_CN': '是啊！\\.年轻真好。',
						'ja_JP': 'もちろん楽しんでおられるでしょうね！\\. \n若さとはいいものだ！',
						'ko_KR': '물론 그랬겠죠, 하하!\\. 다시 젊어진 것 같은 기분이군요.'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'But... back to work.\\. It looks like you still need to defeat \\c[3]\\v[quest.my-first-quest.subrequire.0] of these \\v[combat.name.hedgehog]s\\c[0].',
						'de_DE': 'Aber was soll\'s, die Pflicht ruft.\\. Wie es scheint, müssen Sie noch \\c[3]\\v[quest.my-first-quest.subrequire.0] \\v[combat.name.hedgehog]\\c[0] besiegen.<<A<<[CHANGED 2018/09/25]',
						'fr_FR': 'fr_FR',
						'zh_CN': '不过…还是谈谈工作吧。\\.看样子你还需要击败\\c[3]\\v[quest.my-first-quest.subrequire.0]\\c[0]只\\v[combat.name.hedgehog]\\c[0]。<<A<<[CHANGED 2018/09/19]',
						'ja_JP': 'でも…仕事に戻ってください。\\. 倒すべき\\v[combat.name.hedgehog]\\c[0]があと\\c[3]\\v[quest.my-first-quest.subrequire.0]匹残っているようですよ。<<A<<[CHANGED 2018/09/19]',
						'langUid': 29,
						'ko_KR': '하지만... 다시 일하러 가보셔야겠네요.\\. 아직 처치해야 할 \\c[3]\\v[quest.my-first-quest.subrequire.0] \\v[combat.name.hedgehog]\\c[0]가 남아 있습니다.<<A<<[CHANGED 2018/09/19]'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				}
			]
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest.task.1',
			'config': 'normal',
			'event': {
				'quest': [
					{
						'name': {
							'en_US': 'Humble Helper',
							'langUid': 216,
							'zh_CN': '谦卑的助手',
							'de_DE': 'Bescheidener Betreuer<<A<<[CHANGED 2017/07/04]',
							'fr_FR': '',
							'ja_JP': '控えめなお手伝い',
							'ko_KR': '미천한 도우미'
						},
						'side': 'LEFT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'side': 'RIGHT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'main.lea',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'message': {
							'en_US': 'Wow Ms. \\v[lore.title.seeker], you really did it!\\. Here\'s your rewards for it!',
							'de_DE': 'Mensch, Frau \\v[lore.title.seeker], Sie haben es wirklich geschafft! Hier ist Ihre Belohnung!',
							'fr_FR': 'fr_FR',
							'zh_CN': '喔，\\v[lore.title.seeker]小姐，你真的做到了！这是给你的奖励！',
							'ja_JP': 'おお、\\v[lore.title.seeker]さん、終わったようですね！\\.\nでは、報酬を受けとってください！',
							'langUid': 37,
							'ko_KR': '와, \\v[lore.title.seeker] 양, 정말 해냈군요!\\. 보상을 드릴게요!'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': '...!',
							'de_DE': '...!',
							'fr_FR': 'fr_FR',
							'langUid': 43,
							'zh_CN': '…！',
							'ja_JP': '…！',
							'ko_KR': '...!'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'EXCITED'
						},
						'type': 'SHOW_MSG'
					},
					{
						'side': 'ALL',
						'type': 'CLEAR_MSG'
					},
					{
						'ignoreSlowDown': false,
						'type': 'WAIT',
						'time': 0.2
					},
					{
						'type': 'SOLVE_QUEST_CONDITION',
						'quest': {
							'quest': 'my-first-quest',
							'label': 'done'
						}
					}
				]
			}
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest.solved',
			'config': 'normal',
			'event': {
				'quest': [
					{
						'name': {
							'en_US': 'Humble Helper',
							'langUid': 217,
							'zh_CN': '谦卑的助手',
							'de_DE': 'Bescheidener Betreuer<<A<<[CHANGED 2017/07/04]',
							'fr_FR': '',
							'ja_JP': '控えめなお手伝い',
							'ko_KR': '미천한 도우미'
						},
						'side': 'LEFT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'side': 'RIGHT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'main.lea',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'message': {
							'en_US': 'Hello Ms. \\v[lore.title.seeker], ready for another quest?\\. I even have more equipment as a reward.',
							'de_DE': 'Hallo, Frau \\v[lore.title.seeker]! Sind Sie bereit für noch eine Quest, um sich den Rest der Ausrüstung zu verdienen?',
							'fr_FR': 'fr_FR',
							'zh_CN': '你好，\\v[lore.title.seeker]小姐，准备进行另一项任务了吗？我这还有许多奖励装备哦。',
							'ja_JP': 'こんにちは、\\v[lore.title.seeker]さん。次のクエストを受ける準備ができたんですか？\\.今回は報酬としてもっと装備品を用意してありますよ。',
							'langUid': 60,
							'ko_KR': '안녕하세요, \\v[lore.title.seeker] 양. 다른 퀘스트를 할 준비가 되셨나요?\\. 보상으로 더 많은 장비를 준비해 놨답니다.'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'activate': false,
						'acceptVar': 'tmp.accept',
						'type': 'OPEN_QUEST_DIALOG',
						'quest': 'my-first-quest_2',
						'accepted': [
							{
								'type': 'SET_MSG_EXPRESSION',
								'person': {
									'person': 'main.lea',
									'expression': 'PROUD'
								}
							},
							{
								'message': {
									'en_US': 'Happy collecting and remember that different plants yield different items!',
									'de_DE': 'Frohes Sammeln! Und nicht vergessen: Verschiedene Pflanzen tragen verschiedene Items!',
									'fr_FR': 'fr_FR',
									'langUid': 58,
									'zh_CN': '祝你收集愉快！记住，不同的植物会收获不同的物品！',
									'ja_JP': '素材集めを楽しんでください！植物ごとに取れるアイテムが異なることも忘れずに！',
									'ko_KR': '즐거운 수집 되시고 다른 식물에서 다른 아이템을 얻을 수 있다는 걸 잊지 마세요!'
								},
								'autoContinue': false,
								'person': {
									'person': 'rookie-harbor.man-big-black',
									'expression': 'DEFAULT'
								},
								'type': 'SHOW_MSG'
							}
						],
						'declined': [
							{
								'type': 'SET_MSG_EXPRESSION',
								'person': {
									'person': 'main.lea',
									'expression': 'NERVOUS'
								}
							},
							{
								'message': {
									'en_US': 'Oh, okay!\\. No Problem Ms. \\v[lore.title.seeker].\\. Please come back if you changed your mind.',
									'de_DE': 'Oh, na ja! Kein Problem, Frau \\v[lore.title.seeker]. Kommen Sie einfach wieder, wenn Sie die Quest doch machen wollen.',
									'fr_FR': 'fr_FR',
									'zh_CN': '哦，好的！没问题，\\v[lore.title.seeker]小姐。如果你改变主意的话，请回来找我。',
									'ja_JP': 'ああ、いいんですよ！\\.お気になさらないでください、\\v[lore.title.seeker]さん。\\.気が変わったら戻ってきてくださいね。',
									'langUid': 59,
									'ko_KR': '알겠습니다!\\. 문제없어요, \\v[lore.title.seeker] 양.\\. 마음이 바뀌면 다시 절 찾아주세요.'
								},
								'autoContinue': false,
								'person': {
									'person': 'rookie-harbor.man-big-black',
									'expression': 'DEFAULT'
								},
								'type': 'SHOW_MSG'
							}
						]
					}
				]
			}
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest_2.started',
			'config': 'normal',
			'event': [
				{
					'name': {
						'en_US': 'Humble Helper',
						'langUid': 218,
						'zh_CN': '谦卑的助手',
						'de_DE': 'Bescheidener Betreuer<<A<<[CHANGED 2017/07/04]',
						'fr_FR': '',
						'ja_JP': '控えめなお手伝い',
						'ko_KR': '미천한 도우미'
					},
					'side': 'LEFT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'side': 'RIGHT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'main.lea',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'message': {
						'de_DE': 'Hi!',
						'en_US': 'Hi!',
						'langUid': 50,
						'fr_FR': '',
						'zh_CN': '你好！',
						'ja_JP': 'やぁ！',
						'ko_KR': '안녕!'
					},
					'autoContinue': false,
					'person': {
						'person': 'main.lea',
						'expression': 'PROUD'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'Hello Ms. \\v[lore.title.seeker]!\\. Enjoying the adventure?',
						'de_DE': 'Hallo, Frau \\v[lore.title.seeker]!\\. Genießen Sie Ihre abenteuerliche Reise?',
						'fr_FR': 'fr_FR',
						'zh_CN': '你好，\\v[lore.title.seeker]小姐！\\.游戏玩得还愉快吗？',
						'ja_JP': 'こんにちは、\\v[lore.title.seeker]さん！\\.旅路は楽しまれていますか？',
						'langUid': 51,
						'ko_KR': '안녕하세요, \\v[lore.title.seeker] 양!\\. 모험은 즐기고 있나요?'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'de_DE': '...',
						'en_US': '...',
						'langUid': 52,
						'fr_FR': '',
						'zh_CN': '…',
						'ja_JP': '…',
						'ko_KR': '...'
					},
					'autoContinue': false,
					'person': {
						'person': 'main.lea',
						'expression': 'NOD'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'Of course you do, haha!\\. Oh to be young again!',
						'de_DE': 'Natürlich tun Sie das, haha!\\. Ach Mann, noch einmal jung sein!<<C<<LR: "Oh, noch einmal jung zu sein!"',
						'fr_FR': 'fr_FR',
						'langUid': 210,
						'zh_CN': '是啊！\\.年轻真好。',
						'ja_JP': 'もちろん楽しんでおられるでしょうね！\\. 若さとはいいものだ！',
						'ko_KR': '물론 그렇겠죠, 하하!\\. 다시 젊어진 것 같은 기분이군요.'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': 'But... back to work.\\. It looks like you still need to collect some of the \\c[3]items\\c[0].',
						'de_DE': 'Aber was solls, die Pflicht ruft.\\. Wie es scheint, müssen Sie noch ein paar der \\c[3]Items\\c[0] sammeln.',
						'fr_FR': 'fr_FR',
						'langUid': 211,
						'zh_CN': '不过…还是谈谈工作吧。\\.看样子你还需要再收集一些\\c[3]items\\c[0]。',
						'ja_JP': 'でも…仕事に戻ってください。\\.集めるべき\\c[3]アイテム\\c[0]の量がまだ足りないようですよ。',
						'ko_KR': '하지만... 다시 일 얘기를 해야겠네요.\\. 아직 수집해야 할 \\c[3]아이템\\c[0]이 남아 있습니다.'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				}
			]
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest_2.task.1',
			'config': 'normal',
			'event': {
				'quest': [
					{
						'name': {
							'en_US': 'Humble Helper',
							'langUid': 219,
							'zh_CN': '谦卑的助手',
							'de_DE': 'Bescheidener Betreuer<<A<<[CHANGED 2017/07/04]',
							'fr_FR': '',
							'ja_JP': '控えめなお手伝い',
							'ko_KR': '미천한 도우미'
						},
						'side': 'LEFT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'side': 'RIGHT',
						'order': 0,
						'clearSide': false,
						'person': {
							'person': 'main.lea',
							'expression': 'DEFAULT'
						},
						'type': 'ADD_MSG_PERSON'
					},
					{
						'message': {
							'en_US': 'Wow Ms. \\v[lore.title.seeker], you really did it!\\. Here\'s your rewards for it!',
							'de_DE': 'Mensch, Frau \\v[lore.title.seeker], Sie haben es wirklich geschafft! Hier ist Ihre Belohnung!',
							'fr_FR': 'fr_FR',
							'zh_CN': '喔，\\v[lore.title.seeker]小姐，你真的做到了！这是给你的奖励！',
							'ja_JP': 'おお、\\v[lore.title.seeker]さん、終わったようですね！\\.では、報酬を受けとってください！',
							'langUid': 55,
							'ko_KR': '와, \\v[lore.title.seeker] 양, 정말 해냈군요!\\. 보상을 드릴게요!'
						},
						'autoContinue': false,
						'person': {
							'person': 'rookie-harbor.man-big-black',
							'expression': 'DEFAULT'
						},
						'type': 'SHOW_MSG'
					},
					{
						'message': {
							'en_US': '...!',
							'de_DE': '...!',
							'fr_FR': 'fr_FR',
							'langUid': 56,
							'zh_CN': '…！',
							'ja_JP': '…！',
							'ko_KR': '...!'
						},
						'autoContinue': false,
						'person': {
							'person': 'main.lea',
							'expression': 'EXCITED'
						},
						'type': 'SHOW_MSG'
					},
					{
						'side': 'ALL',
						'type': 'CLEAR_MSG'
					},
					{
						'ignoreSlowDown': false,
						'type': 'WAIT',
						'time': 0.2
					},
					{
						'type': 'SOLVE_QUEST_CONDITION',
						'quest': {
							'quest': 'my-first-quest_2',
							'label': 'done'
						}
					}
				]
			}
		},
		{
			'reactType': 'FIXED_POS',
			'face': 'SOUTH',
			'action': [],
			'hidden': false,
			'condition': 'quest.my-first-quest_2.solved',
			'config': 'normal',
			'event': [
				{
					'name': {
						'en_US': 'Humble Helper',
						'langUid': 220,
						'zh_CN': '谦卑的助手',
						'de_DE': 'Bescheidener Betreuer<<A<<[CHANGED 2017/07/04]',
						'fr_FR': '',
						'ja_JP': '控えめなお手伝い',
						'ko_KR': '미천한 도우미'
					},
					'side': 'LEFT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'side': 'RIGHT',
					'order': 0,
					'clearSide': false,
					'person': {
						'person': 'main.lea',
						'expression': 'DEFAULT'
					},
					'type': 'ADD_MSG_PERSON'
				},
				{
					'message': {
						'en_US': 'Hello Ms. \\v[lore.title.seeker]!\\. I hope you enjoy your journey.',
						'de_DE': 'Hallo, Frau \\v[lore.title.seeker]!\\. Ich hoffe, Sie genießen Ihre abenteuerliche Reise.',
						'fr_FR': 'fr_FR',
						'zh_CN': '你好，\\v[lore.title.seeker]小姐！希望你旅途愉快。',
						'ja_JP': 'こんにちは、\\v[lore.title.seeker]さん！\\.どうか旅路を楽しんでくださいね。',
						'langUid': 44,
						'ko_KR': '안녕하세요, \\v[lore.title.seeker] 양!\\. 즐거운 모험 되세요.'
					},
					'autoContinue': false,
					'person': {
						'person': 'rookie-harbor.man-big-black',
						'expression': 'DEFAULT'
					},
					'type': 'SHOW_MSG'
				},
				{
					'message': {
						'en_US': '[nods]',
						'de_DE': '[nickt]',
						'fr_FR': 'fr_FR',
						'langUid': 38,
						'zh_CN': '[点头]',
						'ja_JP': '[うなずく]',
						'ko_KR': '[끄덕]'
					},
					'autoContinue': false,
					'person': {
						'person': 'main.lea',
						'expression': 'NOD'
					},
					'type': 'SHOW_MSG'
				}
			]
		}
	];
	currentState: NPCState;
	
	props = settingsJson.default;
	positionActive = false;
	
	constructor() {
	}
	
	ngOnInit() {
		this.ngOnChanges();
	}
	
	ngOnChanges() {
		this.states.forEach(state => {
			if (!state.position) {
				state.position = {
					x: 0,
					y: 0,
					lvl: 0,
					active: false
				};
			} else {
				state.position.active = true;
			}
		});
	}
	
	selectTab(index: number) {
		this.currentState = this.states[index];
		this.positionActive = this.currentState.position.active;
	}
	
	export() {
		this.states.forEach(state => {
			if (state.position.active) {
				state.position.active = undefined;
			} else {
				state.position = undefined;
			}
		});
		
		return this.states;
	}
}
