/*!
 * FTP Calculator / Calculateur FTP · v1.0.0
 * FTP, 7 power zones (Coggan), W/kg and heart-rate zones. FR/EN. No dependencies.
 * https://github.com/cedricgodart/ftp-calculator · MIT License · Cédric Godart (https://cedric.fm)
 *
 * Usage:
 *   <link rel="stylesheet" href="ftp-calculator.css">
 *   <div data-ftp-calculator data-lang="fr"></div>   (data-lang: "fr" | "en", optional)
 *   <script src="ftp-calculator.js" defer></script>
 *
 * Everything is computed in the browser: no data is sent anywhere.
 */
(function () {
	"use strict";

	// ---------------------------------------------------------------- texts
	var I18N = {
		fr: {
			tabs: { known: "FTP connue", test: "Résultat d'un test", guess: "Jamais testé", hr: "Zones cardiaques" },
			ftp: "FTP (watts)", weight: "Poids (kg, facultatif)", weightReq: "Poids (kg)",
			testType: "Type de test",
			tests: { ramp: "Test rampe (paliers d'1 minute)", "20": "Test de 20 minutes", "60": "Effort d'1 heure" },
			testLabel: { ramp: "Meilleure minute du test (W)", "20": "Puissance moyenne sur 20 min (W)", "60": "Puissance moyenne sur 1 h (W)" },
			testHint: {
				ramp: "FTP = 75 % de la meilleure minute. La puissance monte d'un palier chaque minute (souvent 20 W), jusqu'à ne plus pouvoir tenir.",
				"20": "FTP = 95 % de la moyenne sur 20 minutes, après un échauffement d'au moins 15 minutes.",
				"60": "La moyenne sur une heure à fond est la FTP, sans correction. Exigeant, mais c'est la définition même."
			},
			useTest: "Calculer les zones avec cette FTP",
			sex: "Sexe", male: "Homme", female: "Femme",
			freq: "Séances de vélo par semaine", freqs: ["Moins d'une", "1 ou 2", "3 ou 4", "5 ou plus"],
			guessHint: "Une fourchette indicative, pas une mesure : un point de départ en attendant un vrai test.",
			useGuess: "Calculer les zones avec le milieu de la fourchette",
			age: "Âge", hrmax: "FC max mesurée (facultatif)", hrmaxPh: "si elle est connue",
			hrHint: "Sans FC max mesurée, elle est estimée avec la formule de Tanaka (208 moins 0,7 fois l'âge). L'écart réel peut dépasser 10 battements : une FC max mesurée reste plus fiable.",
			empty: "Les zones s'affichent ici.",
			ftpLabel: "FTP", estimated: "FTP estimée", range: "fourchette indicative",
			guessResult: function (a, b) { return "Soit " + a + " à " + b + " W/kg. Si un effort en zone 4 paraît trop facile ou impossible à tenir, on ajuste."; },
			th: { zone: "Zone", pct: "% FTP", watts: "Watts", wkg: "W/kg", feel: "Ressenti", pctHr: "% FC max", bpm: "Battements/min" },
			hrMeasured: "FC max mesurée", hrEstimated: "FC max estimée",
			to: " à ", ex: "ex.",
			zones: [
				["Récupération active", "Échauffement, retour au calme. On parle sans effort."],
				["Endurance", "Rythme de fond, longs blocs assis. La conversation tient."],
				["Tempo", "Soutenu mais régulier. Les phrases raccourcissent."],
				["Seuil", "Montées et blocs de 5 à 20 min. Ça brûle, mais ça se tient."],
				["VO2max", "Intervalles de 2 à 5 min. Plus un mot, la respiration commande."],
				["Capacité anaérobie", "Attaques de 30 s à 2 min, souvent en danseuse."],
				["Neuromusculaire", "Sprints de quelques secondes, tout ce qui reste."]
			],
			hrZones: ["Très facile", "Facile", "Modéré", "Difficile", "Maximal"],
			credit: "Calculateur FTP par"
		},
		en: {
			tabs: { known: "Known FTP", test: "Test result", guess: "Never tested", hr: "Heart-rate zones" },
			ftp: "FTP (watts)", weight: "Weight (kg, optional)", weightReq: "Weight (kg)",
			testType: "Test type",
			tests: { ramp: "Ramp test (1-minute steps)", "20": "20-minute test", "60": "1-hour effort" },
			testLabel: { ramp: "Best minute of the test (W)", "20": "Average power over 20 min (W)", "60": "Average power over 1 h (W)" },
			testHint: {
				ramp: "FTP = 75% of the best minute. Power goes up one step every minute (often 20 W) until you can no longer hold it.",
				"20": "FTP = 95% of the 20-minute average, after a warm-up of at least 15 minutes.",
				"60": "Your all-out one-hour average is your FTP, with no correction. Demanding, but that is the very definition."
			},
			useTest: "Calculate zones with this FTP",
			sex: "Sex", male: "Male", female: "Female",
			freq: "Rides per week", freqs: ["Less than one", "1 or 2", "3 or 4", "5 or more"],
			guessHint: "An indicative range, not a measurement: a starting point until you take a real test.",
			useGuess: "Calculate zones with the middle of the range",
			age: "Age", hrmax: "Measured max HR (optional)", hrmaxPh: "if known",
			hrHint: "Without a measured max HR, it is estimated with the Tanaka formula (208 minus 0.7 times age). The real value can be more than 10 beats off: a measured max HR is more reliable.",
			empty: "Your zones will appear here.",
			ftpLabel: "FTP", estimated: "estimated FTP", range: "indicative range",
			guessResult: function (a, b) { return "That is " + a + " to " + b + " W/kg. If a zone 4 effort feels too easy or impossible to hold, adjust."; },
			th: { zone: "Zone", pct: "% FTP", watts: "Watts", wkg: "W/kg", feel: "How it feels", pctHr: "% max HR", bpm: "Beats/min" },
			hrMeasured: "measured max HR", hrEstimated: "estimated max HR",
			to: " to ", ex: "e.g.",
			zones: [
				["Active recovery", "Warm-up, cool-down. Talking is effortless."],
				["Endurance", "Steady base pace, long seated blocks. You can hold a conversation."],
				["Tempo", "Sustained but steady. Sentences get shorter."],
				["Threshold", "Climbs and 5 to 20-minute blocks. It burns, but you can hold it."],
				["VO2max", "2 to 5-minute intervals. No more talking, breathing takes over."],
				["Anaerobic capacity", "30 s to 2-minute attacks, often out of the saddle."],
				["Neuromuscular", "Sprints of a few seconds, everything you have left."]
			],
			hrZones: ["Very easy", "Easy", "Moderate", "Hard", "Maximal"],
			credit: "FTP calculator by"
		}
	};

	// ---------------------------------------------------------------- models
	// Coggan power zones, as fractions of FTP
	var ZONES = [
		{ lo: 0,    hi: 0.55, c: "#9aa0a6" },
		{ lo: 0.56, hi: 0.75, c: "#5b9bd5" },
		{ lo: 0.76, hi: 0.90, c: "#4cb782" },
		{ lo: 0.91, hi: 1.05, c: "#e6c229" },
		{ lo: 1.06, hi: 1.20, c: "#f08a3c" },
		{ lo: 1.21, hi: 1.50, c: "#ff6b4a" },
		{ lo: 1.51, hi: null, c: "#b59dbe" }
	];
	// Heart-rate zones, as fractions of max HR
	var HR_ZONES = [[0.50, 0.60, "#9aa0a6"], [0.60, 0.70, "#5b9bd5"], [0.70, 0.80, "#4cb782"], [0.80, 0.90, "#f08a3c"], [0.90, 1, "#ff6b4a"]];
	// Test result → FTP
	var TEST_FACTOR = { ramp: 0.75, "20": 0.95, "60": 1 };
	// Indicative FTP ranges in W/kg by weekly frequency. NOT scientific norms: adjust to your audience.
	var GUESS = {
		m: [[1.8, 2.3], [2.3, 2.8], [2.8, 3.3], [3.2, 3.8]],
		f: [[1.5, 2.0], [1.9, 2.4], [2.4, 2.9], [2.7, 3.3]]
	};

	// ---------------------------------------------------------------- helpers
	function detectLang(el) {
		var l = (el.getAttribute("data-lang") || document.documentElement.lang || navigator.language || "en").slice(0, 2).toLowerCase();
		return I18N[l] ? l : "en";
	}
	function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

	function mount(el) {
		if (el.__ftpMounted) return;
		el.__ftpMounted = true;
		var lang = detectLang(el), t = I18N[lang];
		var uid = "ftpc" + Math.random().toString(36).slice(2, 8);
		var id = function (n) { return uid + "-" + n; };
		var dec = function (x, d) { var s = x.toFixed(d); return lang === "fr" ? s.replace(".", ",") : s; };
		var pctSign = lang === "fr" ? " %" : "%";
		var range = function (a, b, unit) { return a + t.to + b + (unit || ""); };
		var field = function (name, label, attrs) { return '<div><label for="' + id(name) + '">' + esc(label) + '</label><input id="' + id(name) + '" type="number" ' + attrs + "></div>"; };

		el.classList.add("ftp-calc");
		el.innerHTML =
			'<div class="fc-tabs" role="tablist">' +
				["known", "test", "guess", "hr"].map(function (k, i) {
					return '<button class="fc-tab" role="tab" type="button" data-tab="' + k + '" aria-selected="' + (i === 0) + '">' + esc(t.tabs[k]) + "</button>";
				}).join("") +
			"</div>" +
			'<div class="fc-panel" data-panel="known"><div class="fc-grid">' +
				field("ftp", t.ftp, 'inputmode="numeric" min="50" max="600" placeholder="' + t.ex + ' 200"') +
				field("weight", t.weight, 'inputmode="decimal" min="30" max="200" placeholder="' + t.ex + ' 72"') +
			"</div></div>" +
			'<div class="fc-panel" data-panel="test" hidden><div class="fc-grid">' +
				'<div><label for="' + id("testtype") + '">' + esc(t.testType) + '</label><select id="' + id("testtype") + '">' +
					["ramp", "20", "60"].map(function (k) { return '<option value="' + k + '">' + esc(t.tests[k]) + "</option>"; }).join("") +
				"</select></div>" +
				'<div><label for="' + id("testw") + '" class="fc-testlabel">' + esc(t.testLabel.ramp) + '</label><input id="' + id("testw") + '" type="number" inputmode="numeric" min="50" max="800" placeholder="' + t.ex + ' 280"></div>' +
			'</div><p class="fc-hint fc-testhint">' + esc(t.testHint.ramp) + "</p>" +
			'<button class="fc-btn" type="button" data-use="test">' + esc(t.useTest) + "</button></div>" +
			'<div class="fc-panel" data-panel="guess" hidden><div class="fc-grid">' +
				'<div><label for="' + id("sex") + '">' + esc(t.sex) + '</label><select id="' + id("sex") + '"><option value="m">' + esc(t.male) + '</option><option value="f">' + esc(t.female) + "</option></select></div>" +
				field("gweight", t.weightReq, 'inputmode="decimal" min="30" max="200" placeholder="' + t.ex + ' 72"') +
				'<div><label for="' + id("freq") + '">' + esc(t.freq) + '</label><select id="' + id("freq") + '">' +
					t.freqs.map(function (f, i) { return '<option value="' + i + '"' + (i === 1 ? " selected" : "") + ">" + esc(f) + "</option>"; }).join("") +
				"</select></div>" +
			'</div><p class="fc-hint">' + esc(t.guessHint) + "</p>" +
			'<button class="fc-btn" type="button" data-use="guess">' + esc(t.useGuess) + "</button></div>" +
			'<div class="fc-panel" data-panel="hr" hidden><div class="fc-grid">' +
				field("age", t.age, 'inputmode="numeric" min="14" max="90" placeholder="' + t.ex + ' 45"') +
				field("hrmax", t.hrmax, 'inputmode="numeric" min="120" max="230" placeholder="' + esc(t.hrmaxPh) + '"') +
			'</div><p class="fc-hint">' + esc(t.hrHint) + "</p></div>" +
			'<div class="fc-result" aria-live="polite"><span class="fc-muted">' + esc(t.empty) + "</span></div>";

		var $ = function (n) { return el.querySelector("#" + id(n)); };
		var num = function (n) { var v = parseFloat(String($(n).value).replace(",", ".")); return isFinite(v) && v > 0 ? v : null; };
		var out = el.querySelector(".fc-result");
		var current = "known";

		function powerTable(ftp, kg) {
			var h = '<div class="fc-big">' + Math.round(ftp) + " W<small>" + t.ftpLabel + (kg ? " · " + dec(ftp / kg, 2) + " W/kg" : "") + "</small></div>";
			h += '<div class="fc-scroll"><table><thead><tr><th>' + t.th.zone + "</th><th>" + t.th.pct + "</th><th>" + t.th.watts + "</th>" +
				(kg ? "<th>" + t.th.wkg + "</th>" : "") + '<th class="fc-hide-sm">' + t.th.feel + "</th></tr></thead><tbody>";
			ZONES.forEach(function (z, i) {
				var loW = Math.round(ftp * z.lo), hiW = z.hi ? Math.round(ftp * z.hi) : null, topW = Math.round(ftp * 1.5);
				var pct = z.lo === 0 ? "≤ 55" + pctSign : (z.hi ? range(Math.round(z.lo * 100), Math.round(z.hi * 100), pctSign) : "> 150" + pctSign);
				var w = z.lo === 0 ? "≤ " + hiW : (hiW ? range(loW, hiW) : "> " + topW);
				var wk = "";
				if (kg) {
					var f = function (x) { return dec(x / kg, 1); };
					wk = '<td class="fc-num">' + (z.lo === 0 ? "≤ " + f(hiW) : (hiW ? range(f(loW), f(hiW)) : "> " + f(topW))) + "</td>";
				}
				h += '<tr><td><span class="fc-z"><span class="fc-dot" style="background:' + z.c + '"></span>Z' + (i + 1) + " " + esc(t.zones[i][0]) + "</span></td>" +
					'<td class="fc-num">' + pct + '</td><td class="fc-num">' + w + " W</td>" + wk +
					'<td class="fc-muted fc-hide-sm">' + esc(t.zones[i][1]) + "</td></tr>";
			});
			return h + "</tbody></table></div>";
		}

		function render() {
			var h = "";
			if (current === "known") {
				var ftp = num("ftp");
				if (ftp) h = powerTable(ftp, num("weight"));
			} else if (current === "test") {
				var w = num("testw");
				if (w) h = '<div class="fc-big">' + Math.round(w * TEST_FACTOR[$("testtype").value]) + " W<small>" + t.estimated + "</small></div>";
			} else if (current === "guess") {
				var kg = num("gweight");
				if (kg) {
					var r = GUESS[$("sex").value][+$("freq").value];
					h = '<div class="fc-big">' + range(Math.round(r[0] * kg), Math.round(r[1] * kg)) + " W<small>" + t.range + "</small></div>" +
						'<p class="fc-hint">' + esc(t.guessResult(dec(r[0], 1), dec(r[1], 1))) + "</p>";
				}
			} else if (current === "hr") {
				var age = num("age"), max = num("hrmax");
				var hrmax = max || (age ? Math.round(208 - 0.7 * age) : null);
				if (hrmax) {
					h = '<div class="fc-big">' + hrmax + " bpm<small>" + (max ? t.hrMeasured : t.hrEstimated) + "</small></div>" +
						'<div class="fc-scroll"><table><thead><tr><th>' + t.th.zone + "</th><th>" + t.th.pctHr + "</th><th>" + t.th.bpm + "</th></tr></thead><tbody>";
					HR_ZONES.forEach(function (z, i) {
						h += '<tr><td><span class="fc-z"><span class="fc-dot" style="background:' + z[2] + '"></span>Z' + (i + 1) + " " + esc(t.hrZones[i]) + "</span></td>" +
							'<td class="fc-num">' + range(Math.round(z[0] * 100), Math.round(z[1] * 100), pctSign) + "</td>" +
							'<td class="fc-num">' + range(Math.round(hrmax * z[0]), Math.round(hrmax * z[1])) + "</td></tr>";
					});
					h += "</tbody></table></div>";
				}
			}
			out.innerHTML = h || '<span class="fc-muted">' + esc(t.empty) + "</span>";
		}

		function show(tab) {
			current = tab;
			el.querySelectorAll(".fc-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-tab") === tab)); });
			el.querySelectorAll(".fc-panel").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== tab; });
			render();
		}

		el.querySelectorAll(".fc-tab").forEach(function (b) { b.addEventListener("click", function () { show(b.getAttribute("data-tab")); }); });
		el.querySelectorAll("input, select").forEach(function (i) { i.addEventListener("input", render); });
		$("testtype").addEventListener("change", function () {
			el.querySelector(".fc-testlabel").textContent = t.testLabel[this.value];
			el.querySelector(".fc-testhint").textContent = t.testHint[this.value];
			render();
		});
		el.querySelectorAll("[data-use]").forEach(function (b) {
			b.addEventListener("click", function () {
				var ftp = null;
				if (b.getAttribute("data-use") === "test") {
					var w = num("testw");
					if (w) ftp = w * TEST_FACTOR[$("testtype").value];
				} else {
					var kg = num("gweight");
					if (kg) { var r = GUESS[$("sex").value][+$("freq").value]; ftp = kg * (r[0] + r[1]) / 2; $("weight").value = kg; }
				}
				if (ftp) { $("ftp").value = Math.round(ftp); show("known"); }
			});
		});
	}

	function init(root) { (root || document).querySelectorAll("[data-ftp-calculator]").forEach(mount); }

	// Public API: FtpCalculator.mount(element) for dynamically inserted elements
	window.FtpCalculator = { mount: mount, init: init, version: "1.0.0" };
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { init(); });
	else init();
})();
