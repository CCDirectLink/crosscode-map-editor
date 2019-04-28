import {AfterViewInit, Component, OnInit} from '@angular/core';
import {NpcStatesComponent} from '../../shared/widgets/npc-states-widget/npc-states/npc-states.component';
import {OverlayService} from '../../shared/overlay/overlay.service';
import {Overlay} from '@angular/cdk/overlay';
import { ISelectedTiles } from '../../models/tile-selector';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent {
	private selected: ISelectedTiles;

	constructor(overlayService: OverlayService, overlay: Overlay) {
		// const obj = overlayService.open(NpcStatesComponent, {
		// 	positionStrategy: overlay.position().global()
		// 		.left('28vw')
		// 		.top('calc(64px + 6vh / 2)')
		// });
		// obj.instance.states = [{
		// 	'reactType': 'PUSHABLE',
		// 	'face': 'EAST',
		// 	'action': [
		// 		{
		// 			'value': 0.3,
		// 			'type': 'SET_RELATIVE_SPEED'
		// 		},
		// 		{
		// 			'target': {
		// 				'x': 320,
		// 				'y': 912,
		// 				'lvl': '2'
		// 			},
		// 			'maxTime': 0,
		// 			'distance': 0,
		// 			'precise': false,
		// 			'planOnly': false,
		// 			'teleportOnFail': false,
		// 			'maxDistance': 0,
		// 			'type': 'NAVIGATE_TO_POINT'
		// 		},
		// 		{
		// 			'face': 'SOUTH',
		// 			'rotate': true,
		// 			'rotateSpeed': 3,
		// 			'type': 'SET_FACE'
		// 		},
		// 		{
		// 			'time': 1,
		// 			'type': 'WAIT'
		// 		},
		// 		{
		// 			'target': {
		// 				'x': 240,
		// 				'y': 948,
		// 				'lvl': '2'
		// 			},
		// 			'maxTime': 0,
		// 			'distance': 0,
		// 			'precise': false,
		// 			'planOnly': false,
		// 			'teleportOnFail': false,
		// 			'maxDistance': 0,
		// 			'type': 'NAVIGATE_TO_POINT'
		// 		},
		// 		{
		// 			'face': 'SOUTH',
		// 			'rotate': true,
		// 			'rotateSpeed': 3,
		// 			'type': 'SET_FACE'
		// 		},
		// 		{
		// 			'time': 1,
		// 			'type': 'WAIT'
		// 		},
		// 		{
		// 			'target': {
		// 				'x': 200,
		// 				'y': 952,
		// 				'lvl': '2'
		// 			},
		// 			'maxTime': 0,
		// 			'distance': 0,
		// 			'precise': false,
		// 			'planOnly': false,
		// 			'teleportOnFail': false,
		// 			'maxDistance': 0,
		// 			'type': 'NAVIGATE_TO_POINT'
		// 		},
		// 		{
		// 			'target': {
		// 				'x': 200,
		// 				'y': 992,
		// 				'lvl': '2'
		// 			},
		// 			'maxTime': 0,
		// 			'distance': 0,
		// 			'precise': false,
		// 			'planOnly': false,
		// 			'teleportOnFail': false,
		// 			'maxDistance': 0,
		// 			'type': 'NAVIGATE_TO_POINT'
		// 		},
		// 		{
		// 			'face': 'EAST',
		// 			'rotate': true,
		// 			'rotateSpeed': 3,
		// 			'type': 'SET_FACE'
		// 		},
		// 		{
		// 			'time': 1,
		// 			'type': 'WAIT'
		// 		},
		// 		{
		// 			'target': {
		// 				'x': 276,
		// 				'y': 940,
		// 				'lvl': '2'
		// 			},
		// 			'maxTime': 0,
		// 			'distance': 0,
		// 			'precise': false,
		// 			'planOnly': false,
		// 			'teleportOnFail': false,
		// 			'maxDistance': 0,
		// 			'type': 'NAVIGATE_TO_POINT'
		// 		},
		// 		{
		// 			'face': 'SOUTH',
		// 			'rotate': true,
		// 			'rotateSpeed': 3,
		// 			'type': 'SET_FACE'
		// 		},
		// 		{
		// 			'time': 1,
		// 			'type': 'WAIT'
		// 		}
		// 	],
		// 	'hidden': false,
		// 	'condition': '     ',
		// 	'config': 'normal',
		// 	'event': [
		// 		{
		// 			'side': 'LEFT',
		// 			'order': 0,
		// 			'clearSide': false,
		// 			'person': {
		// 				'person': 'cargo-crew.male-bald',
		// 				'expression': 'DEFAULT'
		// 			},
		// 			'type': 'ADD_MSG_PERSON'
		// 		},
		// 		{
		// 			'side': 'RIGHT',
		// 			'order': 0,
		// 			'clearSide': false,
		// 			'person': {
		// 				'person': 'main.lea',
		// 				'expression': 'NERVOUS'
		// 			},
		// 			'type': 'ADD_MSG_PERSON'
		// 		},
		// 		{
		// 			'withElse': true,
		// 			'type': 'IF',
		// 			'condition': 'plot.line < 15000',
		// 			'thenStep': [
		// 				{
		// 					'withElse': true,
		// 					'condition': 'lea.words.hi',
		// 					'type': 'IF',
		// 					'thenStep': [
		// 						{
		// 							'message': {
		// 								'de_DE': 'Hi!',
		// 								'en_US': 'Hi!',
		// 								'langUid': 19,
		// 								'fr_FR': '',
		// 								'zh_CN': '你好！',
		// 								'ja_JP': 'やぁ！',
		// 								'ko_KR': '안녕!'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'EXCITED'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Tach auch! Du bist ein Besucher, stimmt\'s oder habe ich recht?',
		// 								'en_US': 'Hello there! You must be a guest on this ship, right?',
		// 								'langUid': 20,
		// 								'fr_FR': '',
		// 								'zh_CN': '你好啊！你一定是这艘船上的客人，对吧？',
		// 								'ja_JP': 'やあ、どうも！お前さん、例のお客さんだろう？',
		// 								'ko_KR': '안녕! 이 선박의 손님이구나, 맞지?'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': '...',
		// 								'en_US': '...',
		// 								'langUid': 21,
		// 								'fr_FR': '...',
		// 								'zh_CN': '…',
		// 								'ja_JP': '…',
		// 								'ko_KR': '...'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': '...',
		// 								'en_US': '...',
		// 								'langUid': 22,
		// 								'fr_FR': '...',
		// 								'zh_CN': '…',
		// 								'ja_JP': '…',
		// 								'ko_KR': '...'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Kein Grund, schüchtern zu sein! Wir Seemänner sehen zwar rau aus, sind in Wahrheit aber ganz entspannt.<<A<<[CHANGED 2017/10/13]',
		// 								'en_US': 'Why, don\'t be shy! We seamen may look rough, but we\'re easygoing folks, really.',
		// 								'langUid': 23,
		// 								'fr_FR': '',
		// 								'zh_CN': '哎呀，别害羞啊！我们水手虽然看似粗野，但是我们真的很好相处。<<A<<[CHANGED 2017/07/07]',
		// 								'ja_JP': 'まあ、恥ずかしがらなくてもいいぞ！俺たち船乗りは見た目こそいかついが、中身はいいやつばっかりさ。本当だぜ。<<A<<[CHANGED 2017/08/03]',
		// 								'ko_KR': '에이, 부끄러워하지 마! 우리 바닷사람들은 겉으로는 험악해 보이지만 마음은 여리거든. 정말이야.<<A<<[CHANGED 2017/07/21]'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Willst du wissen was ich hier mache?',
		// 								'en_US': 'You want to know what I\'m doing here?',
		// 								'langUid': 24,
		// 								'fr_FR': '',
		// 								'zh_CN': '你想知道我在这里做什么？',
		// 								'ja_JP': '俺がここで何をしてるか知りたいか？',
		// 								'ko_KR': '여기서 내가 뭘 하고 있었는지 궁금하니?'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'0': [
		// 								{
		// 									'message': {
		// 										'de_DE': '[nickt]',
		// 										'en_US': '[nods]',
		// 										'langUid': 25,
		// 										'fr_FR': '',
		// 										'zh_CN': '[点头]',
		// 										'ja_JP': '[うなずく]',
		// 										'ko_KR': '[끄덕]'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'main.lea',
		// 										'expression': 'NOD'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Ich überprüfe gerade die Solarmodule hier.',
		// 										'en_US': 'I\'m currently checking up on the solar panels here.',
		// 										'langUid': 26,
		// 										'fr_FR': '',
		// 										'zh_CN': '我现在正在检查这里的太阳能电池板。',
		// 										'ja_JP': '俺は今、ここでソーラーパネルをチェックしてるところなんだ。',
		// 										'ko_KR': '지금은 태양 전지판을 확인하고 있었어.'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'entity': {
		// 										'global': true,
		// 										'name': 'solarPanelMaintainer'
		// 									},
		// 									'action': [
		// 										{
		// 											'entity': {
		// 												'global': true,
		// 												'name': 'centerPanel'
		// 											},
		// 											'rotate': true,
		// 											'type': 'SET_FACE_TO_ENTITY'
		// 										}
		// 									],
		// 									'repeating': false,
		// 									'wait': false,
		// 									'keepState': false,
		// 									'immediately': false,
		// 									'type': 'DO_ACTION'
		// 								},
		// 								{
		// 									'entity': {
		// 										'player': true
		// 									},
		// 									'action': [
		// 										{
		// 											'time': 0.2,
		// 											'type': 'WAIT'
		// 										},
		// 										{
		// 											'entity': {
		// 												'global': true,
		// 												'name': 'centerPanel'
		// 											},
		// 											'rotate': true,
		// 											'type': 'SET_FACE_TO_ENTITY'
		// 										}
		// 									],
		// 									'repeating': false,
		// 									'wait': false,
		// 									'keepState': false,
		// 									'immediately': false,
		// 									'type': 'DO_ACTION'
		// 								},
		// 								{
		// 									'pos': {
		// 										'x': 312,
		// 										'y': 752
		// 									},
		// 									'speed': 'SLOW',
		// 									'transition': 'EASE_IN_OUT',
		// 									'wait': false,
		// 									'waitSkip': 0,
		// 									'zoom': 1,
		// 									'type': 'SET_CAMERA_POS'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Sie sind unsere primäre Energiequelle, sollten also besser funktionieren!',
		// 										'en_US': 'These are our primary energy source, so they better work properly!',
		// 										'langUid': 27,
		// 										'fr_FR': '',
		// 										'zh_CN': '这些是我们的主要能量来源，所以必须得让其正常运作！',
		// 										'ja_JP': 'こいつらがこの船の主電源なんだ。しっかり稼動してもらわないとな！',
		// 										'ko_KR': '이 배를 움직일 수 있는 주 에너지원이지. 그러니 잘 작동되는지 항상 확인해야 해!'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Andernfalls bewegt sich unsere gute alte M.S. Solar keinen Zentimeter.',
		// 										'en_US': 'Otherwise our nice and shiny M.S. Solar won\'t budge a centimeter.',
		// 										'langUid': 28,
		// 										'fr_FR': '',
		// 										'zh_CN': '否则的话，我们美丽酷炫的M.S.太阳号就动不了了。',
		// 										'ja_JP': 'ソーラーパネル抜きじゃ、M.S.ソーラー号は1センチも動けやしない。',
		// 										'ko_KR': '그렇지 않으면 우리의 빛나는 M.S. 솔라가 1cm도 움직이지 못할 테니까.'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'speed': 'SLOW',
		// 									'transition': 'EASE_IN_OUT',
		// 									'wait': false,
		// 									'waitSkip': 0,
		// 									'type': 'RESET_CAMERA'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Glaub mir, die Erfahrung, auf dem Ozean festzusitzen, willst du nicht machen.',
		// 										'en_US': 'Trust me, being stuck in the ocean too long is not something you want to experience.',
		// 										'langUid': 29,
		// 										'fr_FR': '',
		// 										'zh_CN': '相信我，长时间被困在海上可不是什么好玩的事。',
		// 										'ja_JP': '海のど真ん中で延々と立ち往生するなんてごめんだろ？',
		// 										'ko_KR': '바다에 오랫동안 갇혀있고 싶지는 않을걸?'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'entity': {
		// 										'global': true,
		// 										'name': 'solarPanelMaintainer'
		// 									},
		// 									'action': [
		// 										{
		// 											'entity': {
		// 												'player': true
		// 											},
		// 											'rotate': true,
		// 											'type': 'SET_FACE_TO_ENTITY'
		// 										}
		// 									],
		// 									'repeating': false,
		// 									'wait': false,
		// 									'keepState': false,
		// 									'immediately': false,
		// 									'type': 'DO_ACTION'
		// 								},
		// 								{
		// 									'entity': {
		// 										'player': true
		// 									},
		// 									'action': [
		// 										{
		// 											'time': 0.2,
		// 											'type': 'WAIT'
		// 										},
		// 										{
		// 											'entity': {
		// 												'global': true,
		// 												'name': 'solarPanelMaintainer'
		// 											},
		// 											'rotate': true,
		// 											'type': 'SET_FACE_TO_ENTITY'
		// 										}
		// 									],
		// 									'repeating': false,
		// 									'wait': false,
		// 									'keepState': false,
		// 									'immediately': false,
		// 									'type': 'DO_ACTION'
		// 								}
		// 							],
		// 							'1': [
		// 								{
		// 									'message': {
		// 										'de_DE': '[schüttelt Kopf]',
		// 										'en_US': '[shakes head]',
		// 										'langUid': 30,
		// 										'fr_FR': '',
		// 										'zh_CN': '[摇头]',
		// 										'ja_JP': '[首を振る]',
		// 										'ko_KR': '[도리도리]'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'main.lea',
		// 										'expression': 'SHAKE'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': '...Nein?\\. Was dann?',
		// 										'en_US': '...No?\\. Then what else?',
		// 										'langUid': 31,
		// 										'fr_FR': '',
		// 										'zh_CN': '…不要吗？\\.那还有什么事吗？',
		// 										'ja_JP': '…いいのか？\\.じゃあ、何だ？',
		// 										'ko_KR': '...아니야?\\. 그럼 무슨 볼일로 온 거니?'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': '...',
		// 										'en_US': '...',
		// 										'langUid': 32,
		// 										'fr_FR': '...',
		// 										'zh_CN': '…',
		// 										'ja_JP': '…',
		// 										'ko_KR': '...'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'main.lea',
		// 										'expression': 'MOPING'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Das führt wohl zu nichts.',
		// 										'en_US': 'This isn\'t going anywhere.',
		// 										'langUid': 33,
		// 										'fr_FR': '',
		// 										'zh_CN': '那没什么好说的了。',
		// 										'ja_JP': '話にならねえな。',
		// 										'ko_KR': '대화가 안 되는구나.'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Dann lass mich mal wieder meine Arbeit machen.',
		// 										'en_US': 'Just let me do my work, okay?',
		// 										'langUid': 34,
		// 										'fr_FR': '',
		// 										'zh_CN': '我继续工作了哦。',
		// 										'ja_JP': 'それじゃ、仕事に戻らせてくれ。',
		// 										'ko_KR': '그럼 난 할 일이 있어서 이만.'
		// 									},
		// 									'autoContinue': false,
		// 									'person': {
		// 										'person': 'cargo-crew.male-bald',
		// 										'expression': 'DEFAULT'
		// 									},
		// 									'type': 'SHOW_MSG'
		// 								}
		// 							],
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'options': [
		// 								{
		// 									'label': {
		// 										'de_DE': '[Ja]',
		// 										'en_US': '[Yes]',
		// 										'langUid': 35,
		// 										'fr_FR': '',
		// 										'zh_CN': '[是]',
		// 										'ja_JP': '[はい]',
		// 										'ko_KR': '[예]'
		// 									},
		// 									'activeCondition': null
		// 								},
		// 								{
		// 									'label': {
		// 										'de_DE': '[Nein]',
		// 										'en_US': '[No]',
		// 										'langUid': 36,
		// 										'fr_FR': '',
		// 										'zh_CN': '[否]',
		// 										'ja_JP': '[いいえ]',
		// 										'ko_KR': '[아니요]'
		// 									},
		// 									'activeCondition': null
		// 								}
		// 							],
		// 							'type': 'SHOW_CHOICE'
		// 						},
		// 						{
		// 							'withElse': false,
		// 							'condition': '!map.solarPanelGuyTalked',
		// 							'type': 'IF',
		// 							'thenStep': [
		// 								{
		// 									'changeType': 'set',
		// 									'varName': 'map.solarPanelGuyTalked',
		// 									'value': true,
		// 									'type': 'CHANGE_VAR_BOOL'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Hm... scheinbar hat er gar nicht bemerkt, dass du ein Avatar bist.',
		// 										'en_US': 'Huh... I suppose he did not even notice you are an avatar.',
		// 										'langUid': 37,
		// 										'fr_FR': '',
		// 										'zh_CN': '哈…我想他根本没发现你是个虚拟人物。',
		// 										'ja_JP': 'おや…どうやら彼は君がアバターだと\n 気づかなかったみたいだね。',
		// 										'ko_KR': '흠... 내 생각에는 네가 아바타인 걸 모르는 것 같아.'
		// 									},
		// 									'person': {
		// 										'person': 'main.sergey',
		// 										'expression': 'WHISTLING'
		// 									},
		// 									'type': 'SHOW_SIDE_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Nun ja, das menschliche Aussehen ist ziemlich überzeugend.',
		// 										'en_US': 'Well, the human appearance is pretty convincing.',
		// 										'langUid': 38,
		// 										'fr_FR': '',
		// 										'zh_CN': '嗯，虚拟人物的外表拟真度还是很高的。',
		// 										'ja_JP': 'それだけ人間らしい見た目を\n しているから、かな。',
		// 										'ko_KR': '아바타가 꽤 사람같이 생겼긴 하지.'
		// 									},
		// 									'person': {
		// 										'person': 'main.sergey',
		// 										'expression': 'THINKING'
		// 									},
		// 									'type': 'SHOW_SIDE_MSG'
		// 								},
		// 								{
		// 									'message': {
		// 										'de_DE': 'Abgesehen von der Haarfarbe...',
		// 										'en_US': 'Except for the hair color...',
		// 										'langUid': 39,
		// 										'fr_FR': '',
		// 										'zh_CN': '除了这头发的颜色…',
		// 										'ja_JP': 'その髪の色を除けばだけどね…',
		// 										'ko_KR': '머리 색깔만 빼고 말이야...'
		// 									},
		// 									'person': {
		// 										'person': 'main.sergey',
		// 										'expression': 'ROLL_EYES'
		// 									},
		// 									'type': 'SHOW_SIDE_MSG'
		// 								}
		// 							]
		// 						}
		// 					],
		// 					'elseStep': [
		// 						{
		// 							'message': {
		// 								'de_DE': '...',
		// 								'en_US': '...',
		// 								'langUid': 40,
		// 								'fr_FR': '...',
		// 								'zh_CN': '…',
		// 								'ja_JP': '…',
		// 								'ko_KR': '...'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'NERVOUS'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Oh... wer bist du denn?',
		// 								'en_US': 'Oh... who are you?',
		// 								'langUid': 41,
		// 								'fr_FR': '',
		// 								'zh_CN': '哦…你是谁？',
		// 								'ja_JP': 'おや…誰だ？',
		// 								'ko_KR': '오... 넌 누구니?'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': '...',
		// 								'en_US': '...',
		// 								'langUid': 42,
		// 								'fr_FR': '...',
		// 								'zh_CN': '…',
		// 								'ja_JP': '…',
		// 								'ko_KR': '...'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'NERVOUS'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Du siehst nicht wie ein Seemann aus. Also bist du wohl ein Besucher?',
		// 								'en_US': 'You don\'t look like a proper seaman. So, I reckon you\'re a guest?',
		// 								'langUid': 43,
		// 								'fr_FR': '',
		// 								'zh_CN': '你看上去不像是水手。那我猜你是这的客人？',
		// 								'ja_JP': '見た感じ船員じゃなさそうだな。するとあんた、お客さんかい？',
		// 								'ko_KR': '바닷사람같아 보이진 않는데. 손님이로구나?'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': '...',
		// 								'en_US': '...',
		// 								'langUid': 44,
		// 								'fr_FR': '...',
		// 								'zh_CN': '…',
		// 								'ja_JP': '…',
		// 								'ko_KR': '...'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'main.lea',
		// 								'expression': 'NERVOUS'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Nicht sehr gesprächig, hm? Tut mir leid, aber ich stecke gerade mitten in Wartungsarbeiten.',
		// 								'en_US': 'Not very talkative, huh? Sorry, I\'m in the middle of a maintenance routine.',
		// 								'langUid': 45,
		// 								'fr_FR': '',
		// 								'zh_CN': '不喜欢说话，是吗？抱歉，我正在例行维护。',
		// 								'ja_JP': '無口なんだな。悪いんだが、今は点検作業をしてるところでね。',
		// 								'ko_KR': '말 수가 별로 없나 보네. 미안, 난 지금 정비 작업을 하고 있어서.'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						},
		// 						{
		// 							'message': {
		// 								'de_DE': 'Also... entschuldigst du mich bitte?<<A<<[CHANGED 2018/10/04]',
		// 								'en_US': 'So... if you\'d excuse me.',
		// 								'langUid': 46,
		// 								'fr_FR': '',
		// 								'zh_CN': '所以…恕我失陪。<<A<<[CHANGED 2018/09/19]',
		// 								'ja_JP': 'それじゃ…仕事に戻らせてくれ。<<A<<[CHANGED 2018/09/19]',
		// 								'ko_KR': '이만 가봐야겠어.<<A<<[CHANGED 2018/09/19]'
		// 							},
		// 							'autoContinue': false,
		// 							'person': {
		// 								'person': 'cargo-crew.male-bald',
		// 								'expression': 'DEFAULT'
		// 							},
		// 							'type': 'SHOW_MSG'
		// 						}
		// 					]
		// 				}
		// 			],
		// 			'elseStep': [
		// 				{
		// 					'message': {
		// 						'de_DE': 'Hi!<<A<<[CHANGED 2018/08/28]',
		// 						'en_US': 'Hi!',
		// 						'langUid': 909,
		// 						'fr_FR': '',
		// 						'zh_CN': '你好！<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': 'やぁ！<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '안녕!<<A<<[CHANGED 2018/08/28]'
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'main.lea',
		// 						'expression': 'EXCITED'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': 'Oh! You are back again? That\'s a surprise.',
		// 						'de_DE': 'Oh! Du bist wieder da? Überraschend!<<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '哦？你又回来了！真是没想到。<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': 'おお！戻ってきたのか？\nこいつはびっくりだな。<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '오! 다시 돌아왔구나? 놀라운 일이야.<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 910
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'cargo-crew.male-bald',
		// 						'expression': 'DEFAULT'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': 'Last time I wasn\'t even aware that you were one of these "avatars" from the game.',
		// 						'de_DE': 'Letztes Mal war mir nichtmal Bewusst, dass du einer dieser "Avatare" warst von dem Spiel.<<C<<CHECK - LAX<<A<<[CHANGED 2018/10/04]',
		// 						'zh_CN': '上次见面的时候我都没注意到你是游戏里那种“虚拟人物”。<<A<<[CHANGED 2018/10/04]',
		// 						'ja_JP': '前会ったときは、お前さんがゲームから\nやってきた「アバター」のひとりだなんて\n気づかなかった。<<A<<[CHANGED 2018/10/04]',
		// 						'ko_KR': '지난번에는 네가 게임의 "아바타"라는 걸 알지도 못했었단다.<<A<<[CHANGED 2018/10/04]',
		// 						'langUid': 911
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'cargo-crew.male-bald',
		// 						'expression': 'DEFAULT'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': '...!',
		// 						'de_DE': '...!<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '...!<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': '…！<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '...!<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 912
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'main.lea',
		// 						'expression': 'PROUD'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': 'In fact to me you just looked like one of these fancy youngsters with their colorful hair and tacky clothes.',
		// 						'de_DE': 'Du sahst für mich einfach nur wie eine typische Jugendliche aus, wie sie heute alle rumrennen mit ihren bunden Haaren und kitschigen Klamotten... <<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '你看上去跟那些穿的花里胡哨的年轻人没什么区别。<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': '実際、俺はお前さんを、カラフルな髪で\nけばけばしい服装をした、派手な若者の\n仲間だと思っていたよ。<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '난 네가 그저 휘황찬란한 염색 머리를 하고 멋쟁이 옷을 입은 요즘 젊은이들인 줄 알았거든.<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 913
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'cargo-crew.male-bald',
		// 						'expression': 'DEFAULT'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': 'Oh and horns. Are horns "in" these days?',
		// 						'de_DE': 'Oh und Hörnern! Sind Hörner auch "in" heutzutage?<<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '哦，还有你头上那对角。现在流行这个？<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': 'ああ、それにそのツノもな。\n今どきはそういうのが流行りなのかい？<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '아, 그리고 뿔 말이다. 요즘에는 뿔이 인기 있나?<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 914
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'cargo-crew.male-bald',
		// 						'expression': 'DEFAULT'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': '...',
		// 						'de_DE': '...<<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '...<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': '…<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '...<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 915
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'main.lea',
		// 						'expression': 'HOLD_HORNS_ANNOYED'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': '[shakes head]',
		// 						'de_DE': '[schüttelt Kopf]<<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '[摇头]<<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': '[首を振る]<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '[도리도리]<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 916
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'main.lea',
		// 						'expression': 'SHAKE_EYE_CLOSED'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				},
		// 				{
		// 					'message': {
		// 						'en_US': 'I...\\. I see? Anyway, I hope you enjoy your stay! ',
		// 						'de_DE': 'Nicht? Naja, einen schönen Aufenthalt wünsche ich jedenfalls!<<C<<CHECK - LAX<<A<<[CHANGED 2018/08/28]',
		// 						'zh_CN': '呃...\\.好吧？总之，希望你在船上一切顺心。 <<A<<[CHANGED 2018/08/28]',
		// 						'ja_JP': 'そ…\\.そうなのか？とにかく、\nゆっくりしていってくれよ！<<A<<[CHANGED 2018/08/28]',
		// 						'ko_KR': '아...\\. 그렇군. 아무튼 좋은 시간 보내렴!<<A<<[CHANGED 2018/08/28]',
		// 						'langUid': 917
		// 					},
		// 					'autoContinue': false,
		// 					'person': {
		// 						'person': 'cargo-crew.male-bald',
		// 						'expression': 'DEFAULT'
		// 					},
		// 					'type': 'SHOW_MSG'
		// 				}
		// 			]
		// 		}
		// 	]
		// }];
	}
	
	selectionChanged(selected: ISelectedTiles) {
		this.selected = selected;
	}
}
