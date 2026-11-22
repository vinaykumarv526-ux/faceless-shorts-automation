import re
import json
from pathlib import Path

# Built-in Library of High-Retention 9-Cut Architectural Blueprints
# Every topic follows the Viral Retention Loop Formula:
# Cut 1: Hook (Counter-intuitive metric / question)
# Cut 2: Flawed Myth (Linear / naive assumption)
# Cut 3: Failure Point (System crash / red overload warning)
# Cut 4: Architectural Secret (Internal PMIC / IC / hardware cutaway)
# Cut 5: Flow / Dynamics (Moving particles, high-velocity flux)
# Cut 6: Self-Balancing Loop (Thermal / impedance feedback governor)
# Cut 7: Engine X-Ray (High-frequency telemetry radar / sensor grid)
# Cut 8: Efficiency Metric (Percentage gauge / macro leverage point)
# Cut 9: Loop Outro (Protective shield principle looping back to Cut 1)

FRESH_TOPICS = [
    {
        "id": "arch_oled_burnin",
        "niche": "technology",
        "title": "Why OLED Screens Burn In",
        "hook": "Why do OLED phone screens give you pitch-black contrast, but permanently burn in static icons?",
        "tags": ["shorts", "tech", "oled", "smartphones", "engineering", "hardware"],
        "thumb_hook": "OLED BURN IN",
        "thumb_badge": "[HARDWARE ARCHITECTURE]",
        "thumb_sub": "THE BLUE PIXEL DECAY",
        "accent_color": "#FF3B30",
        "blueprint": {
            "cut1_badge": "[HARDWARE ARCHITECTURE: OLED PANEL]",
            "cut1_metric": "99.9%",
            "cut1_tag1": "INFINITE CONTRAST RATIO",
            "cut1_tag2": "BLUE SUBPIXEL DECAY",
            "cut2_badge": "[THE FLAWED MYTH: UNIFORM WEAR]",
            "cut2_sub": "ASSUMPTION: EQUAL SUBPIXEL LIFE",
            "cut3_badge": "[CRITICAL FAILURE: ORGANIC DECAY]",
            "cut3_alert": "SUBPIXEL BURNOUT",
            "cut3_warning": "DANGER: PERMANENT GHOST IMAGE",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: SUB-PIXELS]",
            "cut4_chip": "RGB EMITTER",
            "cut4_label": "OLED MATRIX",
            "cut4_mode1": "RED/GREEN: 100,000 HRS",
            "cut4_mode2": "BLUE: HIGH CURRENT DECAY",
            "cut5_badge": "[ELECTRON FLUX: 3.1 VOLT GAP]",
            "cut5_metric": "3.1 ELECTRON VOLTS",
            "cut6_badge": "[SUB-PIXEL SHIFT ALGORITHM]",
            "cut6_tag": "ORBITAL PIXEL NUDGE ACTIVE",
            "cut7_badge": "[COMPENSATION TELEMETRY MAP]",
            "cut7_freq": "MAPPING: VOLTAGE CALIBRATION",
            "cut7_temp": "PANEL STABILITY [NOMINAL]",
            "cut8_badge": "[PANEL LONGEVITY METRIC]",
            "cut8_metric": "50,000",
            "cut8_label": "OPERATING HOURS",
            "cut8_lifespan": "MATRIX COMPENSATION ACTIVE",
            "cut9_badge": "[SYSTEM VERDICT: PANEL PRESERVATION]",
            "cut9_tag1": "PREVENTS STATIC BURNOUT",
            "cut9_tag2": "PROTECTS ORGANIC DIODES"
        },
        "script": {
            "title": "Why OLED Screens Burn In",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "Why do OLED phone screens give you pitch black contrast, but permanently burn in static icons?",
                    "caps": "WHY DO OLEDS | PERMANENTLY *BURN IN?",
                    "gap": 0.22
                },
                {
                    "text": "Most people assume all three subpixels wear down at the exact same uniform rate.",
                    "caps": "PEOPLE ASSUME | *UNIFORM PIXEL WEAR",
                    "gap": 0.22
                },
                {
                    "text": "Keep maximum brightness on a static navigation bar, and blue organic diodes rapidly degrade.",
                    "caps": "BLUE DIODES *DEGRADE | LEAVING GHOST *SHADOWS!",
                    "gap": 0.24
                },
                {
                    "text": "Under an electron microscope, OLED displays use three separate organic emitters with completely different lifespans.",
                    "caps": "THREE SEPARATE *EMITTERS | DIFFERENT *LIFESPANS",
                    "gap": 0.22
                },
                {
                    "text": "Blue light requires three point one electron volts of energy, driving brutal current through fragile polymer chains.",
                    "caps": "THREE POINT ONE *VOLTS | BRUTAL CURRENT *DENSITY",
                    "gap": 0.22
                },
                {
                    "text": "To protect the panel, sub-pixel shifting algorithms silently nudge status icons by two pixels every few minutes.",
                    "caps": "PIXEL SHIFT *ALGORITHM | NUDGES STATUS *ICONS",
                    "gap": 0.24
                },
                {
                    "text": "An onboard display driver continuously maps cumulative voltage across each subpixel zone.",
                    "caps": "DRIVER CHIP *MAPS | VOLTAGE *DEGRADATION",
                    "gap": 0.22
                },
                {
                    "text": "That real time compensation matrix extends panel lifespan to over fifty thousand operating hours.",
                    "caps": "FIFTY THOUSAND *HOURS | MAXIMUM *HEALTH",
                    "gap": 0.24
                },
                {
                    "text": "So when your screen subtly shifts its pixels, it's not a software glitch: it's keeping your display from burning out.",
                    "caps": "PREVENTS *BURNOUT | NOT A *GLITCH",
                    "gap": 0.35
                }
            ]
        }
    },
    {
        "id": "arch_noise_cancelling",
        "niche": "technology",
        "title": "How Noise Cancelling Physically Inverts Sound",
        "hook": "How can your headphones eliminate jet engine roar using nothing but more sound?",
        "tags": ["shorts", "tech", "audio", "noisecancelling", "engineering", "physics"],
        "thumb_hook": "HOW ANC WORKS",
        "thumb_badge": "[ACOUSTIC ARCHITECTURE]",
        "thumb_sub": "THE PHASE INVERSION SECRET",
        "accent_color": "#4FD1E8",
        "blueprint": {
            "cut1_badge": "[ACOUSTIC ARCHITECTURE: PHASE INVERSION]",
            "cut1_metric": "-30dB",
            "cut1_tag1": "JET ENGINE NOISE: 85 DECIBELS",
            "cut1_tag2": "ATTENUATED: 55 DECIBELS",
            "cut2_badge": "[THE FLAWED MYTH: THICK FOAM PADDING]",
            "cut2_sub": "ASSUMPTION: FOAM BLOCKS LOW FREQUENCIES",
            "cut3_badge": "[CRITICAL FAILURE: SOUND PENETRATION]",
            "cut3_alert": "LOW BASS PENETRATION",
            "cut3_warning": "DANGER: AUDITORY FATIGUE RISK",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: DUAL-MIC DSP]",
            "cut4_chip": "DSP ENGINE",
            "cut4_label": "PHASE INVERTER",
            "cut4_mode1": "FEEDFORWARD MIC: EXTERNAL",
            "cut4_mode2": "FEEDBACK MIC: EAR CANAL",
            "cut5_badge": "[SOUND WAVE FLUX: 180 DEGREE FLIP]",
            "cut5_metric": "180° PHASE SHIFT",
            "cut6_badge": "[ZERO-LATENCY FEEDBACK LOOP]",
            "cut6_tag": "SUB-MILLISECOND INVERSION ACTIVE",
            "cut7_badge": "[ACOUSTIC TELEMETRY SENSOR GRID]",
            "cut7_freq": "SAMPLING: 48,000 TIMES / SEC",
            "cut7_temp": "PHASE ALIGNMENT: 99.8% [SYNCED]",
            "cut8_badge": "[NOISE REDUCTION METRIC]",
            "cut8_metric": "98%",
            "cut8_label": "AMBIENT NOISE ERADICATED",
            "cut8_lifespan": "LATENCY: UNDER 15 MICROSECONDS",
            "cut9_badge": "[SYSTEM VERDICT: DESTRUCTIVE INTERFERENCE]",
            "cut9_tag1": "WAVE MEETS INVERTED TROUGH",
            "cut9_tag2": "EQUALS COMPLETE SILENCE"
        },
        "script": {
            "title": "How Noise Cancelling Physically Inverts Sound",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "How can your headphones eliminate jet engine roar using nothing but more sound?",
                    "caps": "HOW DO HEADPHONES | ELIMINATE JET *ROAR?",
                    "gap": 0.22
                },
                {
                    "text": "Most people assume thick acoustic foam absorbs all the incoming decibels.",
                    "caps": "ASSUME THICK *FOAM | BLOCKS ALL *NOISE?",
                    "gap": 0.22
                },
                {
                    "text": "Rely only on passive padding, and long low-frequency rumble cuts straight through into your ear.",
                    "caps": "LOW RUMBLE *CUTS | STRAIGHT INTO *EAR!",
                    "gap": 0.24
                },
                {
                    "text": "Inside, external microphones capture sound waves and route them to an ultra-fast digital signal processor.",
                    "caps": "MICROPHONES *SAMPLE | ULTRA-FAST *PROCESSOR",
                    "gap": 0.22
                },
                {
                    "text": "The chip computes the exact anti-phase wave, inverting peaks into troughs by one hundred eighty degrees.",
                    "caps": "FLIPS WAVE BY | ONE HUNDRED EIGHTY *DEGREES",
                    "gap": 0.22
                },
                {
                    "text": "When the positive air pressure of noise meets the negative pressure of anti-sound, they collide and cancel.",
                    "caps": "PEAKS MEET *TROUGHS | COLLIDE AND *CANCEL",
                    "gap": 0.24
                },
                {
                    "text": "An internal feedback microphone inside your ear canal samples the residual sound forty eight thousand times a second.",
                    "caps": "FORTY EIGHT THOUSAND *TIMES | EVERY *SECOND",
                    "gap": 0.22
                },
                {
                    "text": "That closed loop algorithm wipes out ninety eight percent of continuous background noise in fifteen microseconds.",
                    "caps": "NINETY EIGHT *PERCENT | TOTAL *SILENCE",
                    "gap": 0.24
                },
                {
                    "text": "So noise cancellation isn't deadening the room: it's creating silence by fighting sound with sound.",
                    "caps": "FIGHTS SOUND WITH *SOUND | CREATES REAL *SILENCE",
                    "gap": 0.35
                }
            ]
        }
    },
    {
        "id": "arch_skyscraper_damper",
        "niche": "engineering",
        "title": "How Skyscrapers Survive Earthquakes",
        "hook": "Why don't thousand-foot skyscrapers snap in half during a major earthquake?",
        "tags": ["shorts", "engineering", "architecture", "earthquake", "science", "physics"],
        "thumb_hook": "SKYSCRAPER DAMPER",
        "thumb_badge": "[STRUCTURAL ARCHITECTURE]",
        "thumb_sub": "THE 660-TON PENDULUM",
        "accent_color": "#FFD43B",
        "blueprint": {
            "cut1_badge": "[STRUCTURAL ARCHITECTURE: TUNED DAMPER]",
            "cut1_metric": "660T",
            "cut1_tag1": "TAIPEI 101: 1,667 FEET",
            "cut1_tag2": "SURVIVES 7.4 MAGNITUDE",
            "cut2_badge": "[THE FLAWED MYTH: RIGID CONCRETE]",
            "cut2_sub": "ASSUMPTION: STIFFER TOWERS RESIST FORCES",
            "cut3_badge": "[CRITICAL FAILURE: STRUCTURAL SHEAR]",
            "cut3_alert": "RESONANCE OVERLOAD",
            "cut3_warning": "DANGER: HIGH-CYCLE FATIGUE COLLAPSE",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: TUNED MASS DAMPER]",
            "cut4_chip": "STEEL SPHERE",
            "cut4_label": "660-TON DAMPER",
            "cut4_mode1": "SWAYS IN COUNTER-PHASE",
            "cut4_mode2": "HYDRAULIC ABSORBERS ACTIVE",
            "cut5_badge": "[FORCE DYNAMICS: KINETIC DISSIPATION]",
            "cut5_metric": "40% SWAY REDUCTION",
            "cut6_badge": "[SELF-BALANCING MOMENTUM LOOP]",
            "cut6_tag": "INERTIA COUNTER-TORQUE ACTIVE",
            "cut7_badge": "[HYDRAULIC SENSOR TELEMETRY]",
            "cut7_freq": "RADIAL SHOCK PISTONS: 8 CYLINDERS",
            "cut7_temp": "DISPLACEMENT: 1.5 METERS [CONTROLLED]",
            "cut8_badge": "[STRUCTURAL SURVIVAL METRIC]",
            "cut8_metric": "40%",
            "cut8_label": "TOTAL SWAY ELIMINATED",
            "cut8_lifespan": "WITHSTANDS 134 MPH TYPHOONS",
            "cut9_badge": "[SYSTEM VERDICT: HARMONIC ABSORPTION]",
            "cut9_tag1": "ABSORBS GROUND RESONANCE",
            "cut9_tag2": "KEEPS TOWER VERTICAL"
        },
        "script": {
            "title": "How Skyscrapers Survive Earthquakes",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "Why don't thousand foot skyscrapers snap in half during a major earthquake?",
                    "caps": "WHY DON'T SKYSCRAPERS | *SNAP IN HALF?",
                    "gap": 0.22
                },
                {
                    "text": "Most people assume massive steel buildings are built completely rigid and unmoving.",
                    "caps": "ASSUME BUILDINGS | ARE COMPLETELY *RIGID?",
                    "gap": 0.22
                },
                {
                    "text": "Build a skyscraper completely rigid, and harmonic seismic waves will shear the foundation bolts clean off.",
                    "caps": "RIGID TOWERS *SNAP | SHEARS FOUNDATION *BOLTS!",
                    "gap": 0.24
                },
                {
                    "text": "Suspended between the eighty-seventh and ninety-second floors hangs a six hundred sixty ton steel pendulum.",
                    "caps": "SIX HUNDRED SIXTY TON | SUSPENDED STEEL *SPHERE",
                    "gap": 0.22
                },
                {
                    "text": "When earthquakes or typhoon winds slam the tower to the left, inertia swings this giant sphere to the right.",
                    "caps": "TOWER SWAYS *LEFT | MASS SWINGS *RIGHT",
                    "gap": 0.22
                },
                {
                    "text": "Eight giant hydraulic shock absorbers pump fluid against that momentum, converting violent motion directly into heat.",
                    "caps": "HYDRAULIC *PISTONS | ABSORB VIOLENT *SWAY",
                    "gap": 0.24
                },
                {
                    "text": "Sensors across the superstructure monitor wind shear and sway frequency in real time.",
                    "caps": "SENSORS MONITOR *SWAY | REAL TIME *TELEMETRY",
                    "gap": 0.22
                },
                {
                    "text": "This tuned mass damper cuts building sway by forty percent, keeping the entire structure safely within elastic limits.",
                    "caps": "FORTY PERCENT *STABILIZED | SAFELY WITHIN *LIMITS",
                    "gap": 0.24
                },
                {
                    "text": "So tall buildings don't survive earthquakes by fighting the ground: they survive by letting a giant pendulum sway.",
                    "caps": "SURVIVES BY *SWAYING | NOT BRUTE *FORCE",
                    "gap": 0.35
                }
            ]
        }
    },
    {
        "id": "arch_car_abs",
        "niche": "engineering",
        "title": "How Car ABS Prevents Skidding",
        "hook": "Why does stomping on your car brakes make the pedal violently pulse instead of locking the wheels?",
        "tags": ["shorts", "cars", "abs", "engineering", "brakes", "physics"],
        "thumb_hook": "HOW ABS WORKS",
        "thumb_badge": "[AUTOMOTIVE ARCHITECTURE]",
        "thumb_sub": "THE 15X PER SECOND PULSE",
        "accent_color": "#FFD43B",
        "blueprint": {
            "cut1_badge": "[AUTOMOTIVE ARCHITECTURE: ABS SYSTEM]",
            "cut1_metric": "15x/S",
            "cut1_tag1": "BRAKE PRESSURE: 2,000 PSI",
            "cut1_tag2": "PULSES 15 TIMES A SECOND",
            "cut2_badge": "[THE FLAWED MYTH: FULL CLAMP STOPPING]",
            "cut2_sub": "ASSUMPTION: LOCKED TIRES STOP FASTER",
            "cut3_badge": "[CRITICAL FAILURE: TOTAL LOSS OF STEERING]",
            "cut3_alert": "WHEEL LOCKUP",
            "cut3_warning": "DANGER: ZERO STEERING CONTROL",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: HYDRAULIC VALVE]",
            "cut4_chip": "ABS MODULATOR",
            "cut4_label": "SOLENOID VALVE",
            "cut4_mode1": "PHASE 1: PRESSURE DUMP",
            "cut4_mode2": "PHASE 2: INSTANT RE-APPLY",
            "cut5_badge": "[FLUID FLUX: HIGH-PRESSURE CYCLES]",
            "cut5_metric": "2000 PSI HYDRAULIC PULSE",
            "cut6_badge": "[CLOSED-LOOP WHEEL SPEED GOVERNOR]",
            "cut6_tag": "SLIP RATIO MAINTAINED AT 15%",
            "cut7_badge": "[MAGNETIC TONE RING RADAR]",
            "cut7_freq": "WHEEL SPEED SENSORS: 100 HZ",
            "cut7_temp": "THRESHOLD: DETECTS SLIP IN 10 MS",
            "cut8_badge": "[STOPPING DISTANCE METRIC]",
            "cut8_metric": "30%",
            "cut8_label": "STOPPING DISTANCE REDUCED",
            "cut8_lifespan": "100% STEERING AUTHORITY MAINTAINED",
            "cut9_badge": "[SYSTEM VERDICT: KINETIC FRICTION CONTROL]",
            "cut9_tag1": "PREVENTS HYDROPLANING",
            "cut9_tag2": "KEEPS YOU IN CONTROL"
        },
        "script": {
            "title": "How Car ABS Prevents Skidding",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "Why does slamming your car brakes make the pedal violently shudder instead of locking the wheels?",
                    "caps": "WHY DOES YOUR *BRAKE | PEDAL VIOLENTLY *SHUDDER?",
                    "gap": 0.22
                },
                {
                    "text": "Most drivers assume maximum stopping power comes from locking your tires into a skid.",
                    "caps": "ASSUME LOCKED *TIRES | STOP THE *FASTEST?",
                    "gap": 0.22
                },
                {
                    "text": "Lock your wheels on wet pavement, and rubber loses friction: you instantly lose all steering control.",
                    "caps": "LOCKED TIRES *SKID | ZERO STEERING *CONTROL!",
                    "gap": 0.24
                },
                {
                    "text": "Magnetic sensors on each wheel hub monitor rotational speed every ten milliseconds.",
                    "caps": "MAGNETIC *SENSORS | MONITOR EVERY TEN *MILLISECONDS",
                    "gap": 0.22
                },
                {
                    "text": "The moment a tire begins to lock up, computer controlled solenoid valves release hydraulic fluid.",
                    "caps": "VALVES RELEASE *PRESSURE | RESTORES TIRE *ROTATION",
                    "gap": 0.22
                },
                {
                    "text": "A return pump instantly restores pressure, repeating this clamp and release cycle fifteen times every second.",
                    "caps": "CYCLES FIFTEEN *TIMES | EVERY SINGLE *SECOND",
                    "gap": 0.24
                },
                {
                    "text": "That rapid pulsing you feel under your foot is hydraulic fluid being hammered by the high speed pump.",
                    "caps": "HYDRAULIC *HAMMER | FELT UNDER YOUR *FOOT",
                    "gap": 0.22
                },
                {
                    "text": "Maintaining peak tire grip cuts stopping distance by thirty percent while letting you steer around hazards.",
                    "caps": "THIRTY PERCENT *SHORTER | STEER AROUND *HAZARDS",
                    "gap": 0.24
                },
                {
                    "text": "So don't pump the brakes yourself: keep pushing down and let the computer pulse fifteen times a second.",
                    "caps": "DON'T PUMP *BRAKES | LET ABS PULSE *FAST",
                    "gap": 0.35
                }
            ]
        }
    },
    {
        "id": "arch_airplane_blackbox",
        "niche": "engineering",
        "title": "How Flight Recorders Survive 3,400 G-Force Impacts",
        "hook": "How does an airplane black box survive a 500-mile-per-hour mountain impact and 2,000-degree jet fuel fire?",
        "tags": ["shorts", "aviation", "engineering", "blackbox", "physics", "science"],
        "thumb_hook": "BLACK BOX ARMOR",
        "thumb_badge": "[AEROSPACE ARCHITECTURE]",
        "thumb_sub": "THE 3,400 G SURVIVAL SHELL",
        "accent_color": "#FF9500",
        "blueprint": {
            "cut1_badge": "[AEROSPACE ARCHITECTURE: CRASH RECORDER]",
            "cut1_metric": "3,400G",
            "cut1_tag1": "SURVIVES 500 MPH IMPACT",
            "cut1_tag2": "2,000°F JET FUEL INFERNO",
            "cut2_badge": "[THE FLAWED MYTH: HEAVY SOLID STEEL]",
            "cut2_sub": "ASSUMPTION: SOLID STEEL BLOCKS ALL FORCES",
            "cut3_badge": "[CRITICAL FAILURE: INTERNAL SHOCKWAVE]",
            "cut3_alert": "MEMORY CHIP SHATTER",
            "cut3_warning": "DANGER: KINETIC ENERGY TRANSFER",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: TRIPLE ARMOR]",
            "cut4_chip": "MEMORY CORE",
            "cut4_label": "SOLID STATE CHIP",
            "cut4_mode1": "OUTER: QUARTER-INCH TITANIUM",
            "cut4_mode2": "MID: SILICA THERMAL SHIELD",
            "cut5_badge": "[THERMAL DYNAMICS: 1,100°C RESISTANCE]",
            "cut5_metric": "1,100°C FOR 60 MINUTES",
            "cut6_badge": "[PASSIVE PHASE-CHANGE HEAT GOVERNOR]",
            "cut6_tag": "PARAFFIN ABSORBS CRITICAL HEAT",
            "cut7_badge": "[UNDERWATER BEACON TELEMETRY]",
            "cut7_freq": "SONAR PINGER: 37.5 KHZ ACOUSTIC",
            "cut7_temp": "DEPTH RATING: 20,000 FEET [INTACT]",
            "cut8_badge": "[SURVIVAL INTEGRITY METRIC]",
            "cut8_metric": "100%",
            "cut8_label": "DATA RETENTION CONFIDENCE",
            "cut8_lifespan": "WITHSTANDS 5,000 LBS PENETRATION",
            "cut9_badge": "[SYSTEM VERDICT: INDESTRUCTIBLE RECORD]",
            "cut9_tag1": "PROTECTS CRITICAL TRUTH",
            "cut9_tag2": "SURVIVES CATASTROPHE"
        },
        "script": {
            "title": "How Flight Recorders Survive 3,400 G-Force Impacts",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "How can an airplane flight recorder survive a five hundred mile per hour crash and two thousand degree fire?",
                    "caps": "HOW DO FLIGHT RECORDERS | SURVIVE *FATAL CRASHES?",
                    "gap": 0.22
                },
                {
                    "text": "Most people assume black boxes are just heavy solid blocks of indestructible metal.",
                    "caps": "ASSUME THEY ARE | SOLID *METAL BLOCKS?",
                    "gap": 0.22
                },
                {
                    "text": "Make the box solid steel, and the shockwave passes straight through, shattering the delicate silicon memory chips.",
                    "caps": "SHOCKWAVES *PASS | SHATTERING SILICON *CHIPS!",
                    "gap": 0.24
                },
                {
                    "text": "Inside, memory chips are sealed in three nested armor layers engineered for kinetic and thermal isolation.",
                    "caps": "THREE NESTED *LAYERS | MAXIMUM SHOCK *ARMOR",
                    "gap": 0.22
                },
                {
                    "text": "First, a quarter inch forged titanium shell deflects puncture forces exceeding five thousand pounds.",
                    "caps": "FORGED TITANIUM *SHELL | FIVE THOUSAND *POUNDS",
                    "gap": 0.22
                },
                {
                    "text": "Beneath that, a dry silica thermal barrier and phase change paraffin block one thousand degree jet fuel flames.",
                    "caps": "THERMAL *BARRIER | BLOCKS JET FUEL *FLAMES",
                    "gap": 0.24
                },
                {
                    "text": "An acoustic underwater beacon pulses thirty seven point five kilohertz sonar the instant saltwater touches it.",
                    "caps": "SONAR PINGER *PULSES | TWENTY THOUSAND FEET *DEEP",
                    "gap": 0.22
                },
                {
                    "text": "This survival architecture withstands three thousand four hundred gravities of impact without losing a single audio bit.",
                    "caps": "THREE THOUSAND FOUR HUNDRED *G'S | PERFECT *RETENTION",
                    "gap": 0.24
                },
                {
                    "text": "So black boxes don't survive by being unbreakable: they survive by trapping the data inside three isolated shields.",
                    "caps": "THREE ISOLATED *SHIELDS | PRESERVES THE *TRUTH",
                    "gap": 0.35
                }
            ]
        }
    },
    {
        "id": "arch_jet_turbine_cooling",
        "niche": "engineering",
        "title": "Why Jet Turbine Blades Don't Melt",
        "hook": "Why don't jet engine turbine blades melt when burning gases inside are hotter than the melting point of metal?",
        "tags": ["shorts", "aviation", "engineering", "physics", "science", "jetengine"],
        "thumb_hook": "TURBINES DON'T MELT",
        "thumb_badge": "[THERMODYNAMIC ARCHITECTURE]",
        "thumb_sub": "THE COOLING AIR BLANKET",
        "accent_color": "#FF3B30",
        "blueprint": {
            "cut1_badge": "[THERMODYNAMIC ARCHITECTURE: TURBINE BLADE]",
            "cut1_metric": "1,700°C",
            "cut1_tag1": "GAS TEMP: 1,700°C",
            "cut1_tag2": "BLADE MELTING POINT: 1,300°C",
            "cut2_badge": "[THE FLAWED MYTH: SPECIAL HEAT-PROOF METAL]",
            "cut2_sub": "ASSUMPTION: ALLOY DOES NOT MELT",
            "cut3_badge": "[CRITICAL FAILURE: BLADE LIQUEFACTION]",
            "cut3_alert": "THERMAL CREEP DEFORMATION",
            "cut3_warning": "DANGER: HIGH-PRESSURE BLADE SEPARATION",
            "cut4_badge": "[ARCHITECTURAL SCHEMATIC: INTERNAL LABYRINTH]",
            "cut4_chip": "SINGLE CRYSTAL",
            "cut4_label": "NICKEL SUPERALLOY",
            "cut4_mode1": "BLEED AIR: 650°C COOLANT",
            "cut4_mode2": "CERAMIC THERMAL COATING",
            "cut5_badge": "[AIRFLOW DYNAMICS: BOUNDARY FILM]",
            "cut5_metric": "FILM COOLING HOLES: 0.3MM",
            "cut6_badge": "[CONTINUOUS COOLING AIR GOVERNOR]",
            "cut6_tag": "MICROSCOPIC FILM BLANKET ACTIVE",
            "cut7_badge": "[INFRARED PYROMETER TELEMETRY]",
            "cut7_freq": "OPTICAL SENSING: 10,000 RPM",
            "cut7_temp": "SURFACE TEMP: 950°C [SAFE DELTA 750°C]",
            "cut8_badge": "[THERMAL RESISTANCE METRIC]",
            "cut8_metric": "400°C",
            "cut8_label": "TEMPERATURE DIFFERENTIAL",
            "cut8_lifespan": "10,000 FLIGHT CYCLES SURVIVED",
            "cut9_badge": "[SYSTEM VERDICT: AERODYNAMIC SHIELD]",
            "cut9_tag1": "AIR BLANKET COATS METAL",
            "cut9_tag2": "HOT GAS NEVER TOUCHES SURFACE"
        },
        "script": {
            "title": "Why Jet Turbine Blades Don't Melt",
            "voice": "am_michael",
            "speed": 1.10,
            "lead": 0.35,
            "outro": 0.65,
            "gap": 0.22,
            "music": "bed",
            "lines": [
                {
                    "text": "Why don't jet engine turbine blades melt when burning combustion gases are hotter than metal can survive?",
                    "caps": "WHY DON'T JET *BLADES | MELT IN *INFERNO?",
                    "gap": 0.22
                },
                {
                    "text": "Most people assume aircraft turbines are made from some exotic, heat proof wonder metal.",
                    "caps": "ASSUME THEY ARE | UNMELTABLE *METAL?",
                    "gap": 0.22
                },
                {
                    "text": "Expose even advanced nickel superalloys directly to seventeen hundred degree gas, and they liquefy in seconds.",
                    "caps": "SUPERALLOYS *LIQUEFY | IN JUST *SECONDS!",
                    "gap": 0.24
                },
                {
                    "text": "Inside each blade is a hollow microscopic maze cast from a single continuous nickel crystal.",
                    "caps": "HOLLOW LABYRINTH | CAST FROM A *SINGLE CRYSTAL",
                    "gap": 0.22
                },
                {
                    "text": "High pressure bleed air from the compressor is forced through thousands of laser drilled micro holes.",
                    "caps": "HIGH PRESSURE *AIR | THROUGH LASER *HOLES",
                    "gap": 0.22
                },
                {
                    "text": "This air flows out and coats the blade in an invisible boundary layer film just a fraction of a millimeter thick.",
                    "caps": "COATS THE BLADE IN | AN INVISIBLE *AIR BLANKET",
                    "gap": 0.24
                },
                {
                    "text": "Thermal barrier ceramic coatings insulate the alloy from the boundary air.",
                    "caps": "CERAMIC *BARRIER | DROPS TEMPERATURE *DRASTICALLY",
                    "gap": 0.22
                },
                {
                    "text": "This boundary film lowers metal temperatures by four hundred degrees, keeping the blades solid at ten thousand RPM.",
                    "caps": "FOUR HUNDRED *DEGREES | SAFELY *PRESERVED",
                    "gap": 0.24
                },
                {
                    "text": "So jet turbine blades don't survive by resisting heat: the burning inferno never actually touches the metal.",
                    "caps": "HOT GAS NEVER *TOUCHES | SURVIVES BY AIR *FILM",
                    "gap": 0.35
                }
            ]
        }
    }
]

def get_next_fresh_topic(state, topics_pool=None):
    """
    Returns a guaranteed-fresh topic that has NEVER been scheduled or published before.
    """
    used_ids = set(state.get("used_topic_ids", []))
    used_titles = set(state.get("used_titles", []))

    # Harvest all previously used topics from scheduled_slots
    for slot_info in state.get("scheduled_slots", {}).values():
        if "topic_id" in slot_info:
            used_ids.add(slot_info["topic_id"])
        if "title" in slot_info:
            used_titles.add(slot_info["title"].lower().strip())

    # 1. Search in our curated fresh architectural blueprints first
    for t in FRESH_TOPICS:
        t_id = t["id"]
        t_title = t["title"].lower().strip()
        if t_id not in used_ids and t_title not in used_titles:
            return t

    # 2. Search in external topics pool if provided
    if topics_pool:
        for t in topics_pool:
            t_id = t.get("id")
            t_title = t.get("title", "").lower().strip()
            if t_id not in used_ids and t_title not in used_titles:
                return t

    # 3. Dynamic synthesis if queue ever exhausts
    synth_idx = len(used_ids) + 1
    synth_title = f"How Hydraulic Systems Generate Extreme Force #{synth_idx}"
    return {
        "id": f"arch_synth_{synth_idx}",
        "niche": "engineering",
        "title": synth_title,
        "hook": "How can pressing a tiny brake pedal stop a five-thousand-pound truck?",
        "tags": ["shorts", "engineering", "physics", "hydraulics"],
        "thumb_hook": "HYDRAULIC POWER",
        "thumb_badge": "[MECHANICAL ARCHITECTURE]",
        "thumb_sub": "PASCAL'S INCOMPRESSIBLE LAW",
        "accent_color": "#FFD43B"
    }
