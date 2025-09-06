"""AI-generated legal cases for the trial simulation system."""

from uuid import uuid4
from ..models.trial import Case, Evidence, Witness, CaseRole


def get_generated_cases() -> list[Case]:
    """Get all AI-generated cases.

    Returns:
        List of generated legal cases
    """
    cases_data = [
        # =========================
        # CASE 1: White-Collar Crime
        # =========================
        {
            "title": "State v. Michael Thompson",
            "description": "Corporate embezzlement involving missing funds from a non-profit organization.",
            "charges": ["Embezzlement", "Fraud", "Forgery"],
            "case_facts": (
                "Michael Thompson, the Chief Financial Officer of Bright Futures, a mid-sized non-profit organization, "
                "is accused of embezzling $250,000 over a period of three years. The prosecution claims that Thompson "
                "created fictitious vendor accounts and authorized payments to them, which were later traced to personal "
                "accounts under his control.\n\n"
                "The alleged scheme came to light during a routine external audit when inconsistencies in the expense "
                "reports were discovered. Investigators uncovered a series of wire transfers and falsified invoices tied "
                "to Thompson’s credentials. However, Thompson maintains that other employees also had access to his login "
                "and that he is being scapegoated.\n\n"
                "The defense argues that the organization's lax internal controls made it possible for someone else to "
                "exploit Thompson’s login information. They also claim that Thompson’s lifestyle and financial records "
                "show no significant unexplained wealth accumulation.\n\n"
                "The case hinges on whether Thompson intentionally orchestrated the embezzlement or whether the fraud was "
                "carried out by another individual with access to his credentials."
            ),
            "prosecution_theory": "Thompson deliberately siphoned funds from the non-profit through fake vendor accounts and falsified documents for personal gain.",
            "defense_theory": "Thompson is a scapegoat; poor internal controls allowed someone else to commit the fraud using his login credentials.",
            "evidence": [
                {
                    "title": "Audit Report",
                    "description": "Findings from the external audit",
                    "content": "The report identified $250,000 in discrepancies tied to payments to non-existent vendors.",
                    "evidence_type": "document",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Bank Transfer Records",
                    "description": "Wire transfers from Bright Futures to personal accounts",
                    "content": "Records show multiple transfers to an account under Thompson’s name.",
                    "evidence_type": "digital",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Computer Access Logs",
                    "description": "System logs showing login activity",
                    "content": "Logs reveal suspicious late-night logins from Thompson’s account; IP addresses vary.",
                    "evidence_type": "digital",
                    "submitted_by": "defense",
                    "is_admitted": True
                },
                {
                    "title": "Lifestyle Evidence",
                    "description": "Financial and lifestyle review",
                    "content": "Thompson’s spending patterns do not reflect possession of extra $250,000.",
                    "evidence_type": "document",
                    "submitted_by": "defense",
                    "is_admitted": True
                }
            ],
            "witnesses": [
                {
                    "name": "Laura Jenkins",
                    "background": "45, external auditor with 20 years experience in forensic accounting",
                    "knowledge": "Discovered discrepancies during audit",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Detective Ryan Cole",
                    "background": "38, financial crimes unit investigator",
                    "knowledge": "Investigated transfers and traced them to Thompson’s account",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Sarah Miller",
                    "background": "29, administrative assistant at Bright Futures",
                    "knowledge": "Claims multiple staff members sometimes shared logins for convenience",
                    "bias": "Potentially sympathetic to Thompson as former colleague",
                    "called_by": "defense"
                },
                {
                    "name": "Dr. Alan Reed",
                    "background": "50, forensic IT expert",
                    "knowledge": "Analyzed access logs; suggests possibility of account compromise",
                    "bias": None,
                    "called_by": "defense"
                }
            ],
            "legal_precedents": [
                "United States v. Nosal (2012)",
                "United States v. Czubinski (1997)",
                "State v. Gagne (2009)"
            ]
        },

        # =====================
        # CASE 2: Violent Crime
        # =====================
        {
            "title": "State v. Angela Rivera",
            "description": "Domestic violence and assault case involving conflicting accounts of self-defense.",
            "charges": ["Aggravated Assault", "Domestic Violence"],
            "case_facts": (
                "Angela Rivera, 34, is accused of assaulting her partner, Daniel Brooks, with a kitchen knife during a heated "
                "argument at their apartment. Police were called by a neighbor who reported loud shouting and crashing noises. "
                "When officers arrived, Brooks was found with a deep cut on his arm and Rivera was visibly shaken.\n\n"
                "The prosecution argues that Rivera intentionally attacked Brooks out of anger. They point to past arguments "
                "between the couple and a history of police being called for disturbances, though no charges were filed previously.\n\n"
                "Rivera claims she acted in self-defense after Brooks lunged at her during the argument. She states that she "
                "grabbed the knife out of fear, not with the intention to harm. Rivera has filed past complaints of emotional "
                "abuse but never physical abuse.\n\n"
                "The central issue is whether Rivera acted in self-defense or escalated the argument into a violent assault."
            ),
            "prosecution_theory": "Rivera lost control during the argument and attacked Brooks with a knife out of anger.",
            "defense_theory": "Rivera acted in self-defense when Brooks became physically threatening.",
            "evidence": [
                {
                    "title": "911 Call Recording",
                    "description": "Neighbor’s emergency call",
                    "content": "Caller reported loud argument, shouting, and crashing noises before police arrived.",
                    "evidence_type": "audio",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Medical Report",
                    "description": "Hospital records of Brooks’ injury",
                    "content": "Confirms laceration on arm consistent with knife wound; non-life-threatening.",
                    "evidence_type": "document",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Prior Police Reports",
                    "description": "Past calls for disturbances at residence",
                    "content": "Police were called three times in the past two years for verbal disputes; no arrests.",
                    "evidence_type": "document",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Photographs of Rivera",
                    "description": "Photos taken the night of incident",
                    "content": "Show minor bruising on Rivera’s wrists and upper arm.",
                    "evidence_type": "physical",
                    "submitted_by": "defense",
                    "is_admitted": True
                }
            ],
            "witnesses": [
                {
                    "name": "Daniel Brooks",
                    "background": "36, alleged victim and Rivera’s partner",
                    "knowledge": "Claims Rivera attacked him unprovoked",
                    "bias": "Directly involved and has personal interest",
                    "called_by": "prosecutor"
                },
                {
                    "name": "Officer Emily Carter",
                    "background": "30, responding police officer",
                    "knowledge": "Observed scene, took initial statements, photographed evidence",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Neighbor John Patel",
                    "background": "42, neighbor living next door",
                    "knowledge": "Heard shouting and crashing sounds; did not see incident",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Dr. Michelle Tran",
                    "background": "47, psychologist specializing in domestic abuse",
                    "knowledge": "Can testify about patterns of emotional abuse Rivera reported",
                    "bias": None,
                    "called_by": "defense"
                },
                {
                    "name": "Lisa Hernandez",
                    "background": "28, Rivera’s coworker and friend",
                    "knowledge": "Has heard Rivera discuss emotional abuse by Brooks",
                    "bias": "Close friend of Rivera",
                    "called_by": "defense"
                }
            ],
            "legal_precedents": [
                "State v. Norman (1989)",
                "People v. Humphrey (1996)",
                "State v. Kelly (1984)"
            ]
        },

        # =======================
        # CASE 3: Drug-Related Crime
        # =======================
        {
            "title": "State v. Jamal Harris",
            "description": "Drug possession with intent to distribute after a traffic stop.",
            "charges": ["Possession with Intent to Distribute", "Possession of Drug Paraphernalia"],
            "case_facts": (
                "Jamal Harris, 27, was stopped by police for a broken taillight. During the stop, officers claimed they "
                "smelled marijuana and searched the vehicle without a warrant. They discovered a backpack containing 100 "
                "grams of cocaine packaged in small baggies and a digital scale.\n\n"
                "The prosecution argues that the packaging and scale demonstrate intent to distribute, not personal use. "
                "They also cite text messages on Harris’s phone that appear to reference drug sales.\n\n"
                "The defense argues that the search was unlawful and violated Harris’s Fourth Amendment rights. They also "
                "contend that the backpack was not in Harris’s direct possession but in the back seat where other passengers "
                "had access. Harris maintains that the drugs do not belong to him.\n\n"
                "The case focuses on the legality of the search and whether Harris knowingly possessed the drugs with intent "
                "to distribute."
            ),
            "prosecution_theory": "Harris knowingly possessed and intended to distribute the cocaine found in his vehicle.",
            "defense_theory": "The search was unconstitutional, and the drugs could have belonged to someone else in the vehicle.",
            "evidence": [
                {
                    "title": "Backpack with Cocaine",
                    "description": "Physical drugs found in vehicle",
                    "content": "Contains 100 grams of cocaine in small baggies with digital scale.",
                    "evidence_type": "physical",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Text Messages",
                    "description": "Recovered from Harris’s phone",
                    "content": "Messages reference 'product' and meeting locations consistent with drug sales.",
                    "evidence_type": "digital",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Traffic Stop Body Cam Footage",
                    "description": "Police body camera video",
                    "content": "Shows officers claiming to smell marijuana, then searching vehicle without a warrant.",
                    "evidence_type": "video",
                    "submitted_by": "defense",
                    "is_admitted": True
                },
                {
                    "title": "Passenger Testimony",
                    "description": "Friend who was in the car",
                    "content": "Testifies that the backpack was not Harris’s and multiple people used the car.",
                    "evidence_type": "testimony",
                    "submitted_by": "defense",
                    "is_admitted": True
                }
            ],
            "witnesses": [
                {
                    "name": "Officer Mark Daniels",
                    "background": "35, arresting officer with narcotics unit experience",
                    "knowledge": "Claims strong odor of marijuana justified search",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Detective Carla Ruiz",
                    "background": "41, narcotics investigator",
                    "knowledge": "Expert on drug packaging and distribution",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Kevin Moore",
                    "background": "26, Harris’s friend and passenger",
                    "knowledge": "Claims the drugs did not belong to Harris",
                    "bias": "Personal friend of defendant",
                    "called_by": "defense"
                },
                {
                    "name": "Professor Richard Allen",
                    "background": "60, constitutional law scholar",
                    "knowledge": "Expert on Fourth Amendment and unlawful searches",
                    "bias": None,
                    "called_by": "defense"
                }
            ],
            "legal_precedents": [
                "Terry v. Ohio (1968)",
                "Carroll v. United States (1925)",
                "Arizona v. Gant (2009)"
            ]
        },

        # =====================
        # CASE 4: Property Crime
        # =====================
        {
            "title": "State v. Brian Lopez",
            "description": "Burglary of a local electronics store with disputed identity of perpetrator.",
            "charges": ["Burglary", "Theft", "Property Damage"],
            "case_facts": (
                "Brian Lopez, 22, is accused of breaking into an electronics store at night and stealing laptops and "
                "smartphones worth $15,000. Surveillance footage shows a masked individual breaking a window and entering "
                "the store. The suspect was seen wearing a distinctive hoodie similar to one Lopez owns.\n\n"
                "The prosecution argues that Lopez was identified based on surveillance footage, fingerprints found on "
                "a discarded crowbar near the scene, and testimony from a neighbor who claims to have seen Lopez carrying "
                "boxes late that night.\n\n"
                "The defense argues that the fingerprints on the crowbar may have been transferred at another time since "
                "Lopez worked construction nearby. They also argue that many people own similar hoodies and the video is "
                "too grainy to make a positive identification.\n\n"
                "The case centers on whether the evidence conclusively identifies Lopez as the burglar or whether reasonable "
                "doubt exists."
            ),
            "prosecution_theory": "Lopez was the masked burglar who stole from the electronics store and left physical evidence linking him to the crime.",
            "defense_theory": "The evidence is circumstantial, and Lopez was misidentified; he was not at the scene during the burglary.",
            "evidence": [
                {
                    "title": "Surveillance Footage",
                    "description": "Security video from electronics store",
                    "content": "Shows masked person in hoodie breaking in and stealing electronics.",
                    "evidence_type": "video",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Crowbar with Fingerprints",
                    "description": "Crowbar found outside the store",
                    "content": "Fingerprints match Lopez but could be from unrelated prior contact.",
                    "evidence_type": "physical",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Neighbor Testimony",
                    "description": "Eyewitness account from nearby resident",
                    "content": "Claims to have seen Lopez carrying boxes late at night on burglary date.",
                    "evidence_type": "testimony",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Timecard Records",
                    "description": "Lopez’s work attendance records",
                    "content": "Indicate Lopez clocked out late that evening from a nearby construction site.",
                    "evidence_type": "document",
                    "submitted_by": "defense",
                    "is_admitted": True
                }
            ],
            "witnesses": [
                {
                    "name": "Officer James O’Neill",
                    "background": "40, responding officer",
                    "knowledge": "Collected crowbar and evidence from scene",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Karen White",
                    "background": "54, neighbor near store",
                    "knowledge": "Claims she saw Lopez carrying boxes late at night",
                    "bias": "Eyewitness reliability issues (poor lighting, distance)",
                    "called_by": "prosecutor"
                },
                {
                    "name": "Dr. Samuel Hayes",
                    "background": "55, forensic expert",
                    "knowledge": "Analyzed fingerprints on crowbar",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Maria Lopez",
                    "background": "48, defendant’s mother",
                    "knowledge": "Claims Brian was at home shortly after his work shift",
                    "bias": "Family member of defendant",
                    "called_by": "defense"
                },
                {
                    "name": "David Clark",
                    "background": "33, construction foreman",
                    "knowledge": "Can testify Lopez worked late shift near crime scene",
                    "bias": None,
                    "called_by": "defense"
                }
            ],
            "legal_precedents": [
                "Manson v. Brathwaite (1977)",
                "Neil v. Biggers (1972)",
                "State v. Henderson (2011)"
            ]
        },

        # ===================
        # CASE 5: Cybercrime
        # ===================
        {
            "title": "State v. Sophia Chen",
            "description": "Identity theft and hacking case involving stolen credit card data.",
            "charges": ["Identity Theft", "Unauthorized Computer Access", "Credit Card Fraud"],
            "case_facts": (
                "Sophia Chen, 30, is accused of hacking into a local retailer’s customer database and stealing credit card "
                "information from over 200 customers. Prosecutors allege that Chen used her technical expertise as a former "
                "IT contractor for the retailer to bypass security measures.\n\n"
                "Authorities traced the breach to Chen’s home IP address, and her laptop contained fragments of the stolen "
                "data. However, Chen argues that her Wi-Fi was unsecured and could have been accessed by others. She also "
                "claims that the fragments on her laptop were cached files from her prior IT work and not evidence of active theft.\n\n"
                "The prosecution contends that Chen had both the knowledge and motive, citing financial hardship and her "
                "familiarity with the retailer’s system. The defense insists the digital evidence is circumstantial and "
                "does not prove she executed the breach.\n\n"
                "The case turns on whether prosecutors can establish that Chen intentionally carried out the hack, or "
                "whether someone else exploited her network."
            ),
            "prosecution_theory": "Chen intentionally hacked the retailer’s system and stole customer data using her knowledge and access.",
            "defense_theory": "Chen’s unsecured Wi-Fi and old work files explain the evidence; she did not commit the breach.",
            "evidence": [
                {
                    "title": "Retailer Server Logs",
                    "description": "Digital logs from hacked system",
                    "content": "Show unauthorized access traced to Chen’s home IP address.",
                    "evidence_type": "digital",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Laptop Seizure Report",
                    "description": "Forensic examination of Chen’s laptop",
                    "content": "Contained fragments of customer data and hacking tools.",
                    "evidence_type": "digital",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Financial Records",
                    "description": "Bank statements from Chen",
                    "content": "Show recent large unexplained deposits.",
                    "evidence_type": "document",
                    "submitted_by": "prosecutor",
                    "is_admitted": True
                },
                {
                    "title": "Wi-Fi Router Report",
                    "description": "Analysis of Chen’s home network",
                    "content": "Router had no password protection; potentially open to outside access.",
                    "evidence_type": "digital",
                    "submitted_by": "defense",
                    "is_admitted": True
                },
                {
                    "title": "Employment Records",
                    "description": "Chen’s work history with retailer",
                    "content": "Confirm she had legitimate access to system logs during prior contract work.",
                    "evidence_type": "document",
                    "submitted_by": "defense",
                    "is_admitted": True
                }
            ],
            "witnesses": [
                {
                    "name": "Agent Robert Miller",
                    "background": "46, FBI cybercrime investigator",
                    "knowledge": "Oversaw investigation, traced hack to Chen’s IP",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Karen Li",
                    "background": "37, retailer’s IT security manager",
                    "knowledge": "Explains nature of breach and Chen’s past access",
                    "bias": None,
                    "called_by": "prosecutor"
                },
                {
                    "name": "Dr. Steven Patel",
                    "background": "52, cybersecurity expert",
                    "knowledge": "Can testify about unsecured Wi-Fi risks and possibility of hijacking IP address",
                    "bias": None,
                    "called_by": "defense"
                },
                {
                    "name": "Emily Johnson",
                    "background": "32, former coworker at retailer",
                    "knowledge": "States Chen was disgruntled after her contract ended",
                    "bias": "Negative feelings toward Chen",
                    "called_by": "prosecutor"
                },
                {
                    "name": "Michael Chen",
                    "background": "35, defendant’s brother",
                    "knowledge": "States Sophia often left her Wi-Fi unsecured and others in building could access it",
                    "bias": "Family member of defendant",
                    "called_by": "defense"
                }
            ],
            "legal_precedents": [
                "United States v. Morris (1991)",
                "United States v. Mitra (2005)",
                "State v. Riley (2010)"
            ]
        }

    ]

    cases = []
    for case_data in cases_data:
        # Convert evidence
        evidence = [
            Evidence(
                title=ev["title"],
                description=ev["description"],
                content=ev["content"],
                evidence_type=ev["evidence_type"],
                submitted_by=CaseRole(ev["submitted_by"]),
                is_admitted=ev["is_admitted"]
            )
            for ev in case_data["evidence"]
        ]

        # Convert witnesses
        witnesses = [
            Witness(
                name=w["name"],
                background=w["background"],
                knowledge=w["knowledge"],
                bias=w.get("bias"),
                called_by=CaseRole(w["called_by"])
            )
            for w in case_data["witnesses"]
        ]

        # Create case
        case = Case(
            title=case_data["title"],
            description=case_data["description"],
            charges=case_data["charges"],
            case_facts=case_data["case_facts"],
            prosecution_theory=case_data["prosecution_theory"],
            defense_theory=case_data["defense_theory"],
            evidence=evidence,
            witnesses=witnesses,
            legal_precedents=case_data["legal_precedents"]
        )
        cases.append(case)

    return cases
