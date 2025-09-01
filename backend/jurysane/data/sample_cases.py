"""Sample legal cases for testing and demonstration."""

from uuid import uuid4

from ..models.trial import Case, Evidence, Witness, CaseRole


def get_sample_case() -> Case:
    """Get a sample criminal case for testing.

    Returns:
        Sample criminal case (State v. Johnson - Robbery)
    """
    # Create evidence
    evidence = [
        Evidence(
            title="Security Camera Footage",
            description="Video showing the robbery in progress",
            content="Security camera footage from the convenience store showing a person matching the defendant's description entering the store at 10:47 PM, approaching the counter with what appears to be a weapon, and leaving with cash from the register at 10:52 PM.",
            evidence_type="video",
            submitted_by=CaseRole.PROSECUTOR,
            is_admitted=True,
        ),
        Evidence(
            title="Eyewitness Identification",
            description="Store clerk's identification of the defendant",
            content="Store clerk Sarah Martinez identified the defendant in a lineup as the person who robbed the store. She had a clear view of the perpetrator for approximately 5 minutes during the incident.",
            evidence_type="testimony",
            submitted_by=CaseRole.PROSECUTOR,
            is_admitted=True,
        ),
        Evidence(
            title="Recovered Cash",
            description="Cash found in defendant's possession",
            content="$347 in cash was found in the defendant's jacket pocket when arrested 2 hours after the robbery. The store reported exactly $347 was taken from the register.",
            evidence_type="physical",
            submitted_by=CaseRole.PROSECUTOR,
            is_admitted=True,
        ),
        Evidence(
            title="Alibi Witness Statement",
            description="Friend claims defendant was elsewhere",
            content="Michael Thompson states that the defendant was at his apartment watching a movie from 10:00 PM to 11:30 PM on the night of the robbery. Phone records show a call between them at 10:15 PM.",
            evidence_type="testimony",
            submitted_by=CaseRole.DEFENSE,
            is_admitted=False,
        ),
    ]

    # Create witnesses
    witnesses = [
        Witness(
            name="Sarah Martinez",
            background="Store clerk at QuickMart convenience store. 28 years old, has worked at the store for 3 years. Good eyesight, no prior issues with identifying customers.",
            knowledge="Was working alone during the night shift when the robbery occurred. Had a clear view of the perpetrator, who threatened her with what appeared to be a knife and demanded money from the register.",
            bias=None,
            called_by=CaseRole.PROSECUTOR,
        ),
        Witness(
            name="Officer David Kim",
            background="Police officer with 12 years of experience. First responder to the robbery call. Conducted the arrest of the defendant.",
            knowledge="Responded to the robbery call at 11:05 PM. Found the defendant walking 3 blocks from the store at 11:45 PM. Arrested defendant after finding cash matching the stolen amount in his possession.",
            bias=None,
            called_by=CaseRole.PROSECUTOR,
        ),
        Witness(
            name="Michael Thompson",
            background="Friend of the defendant. 30-year-old construction worker. Has known the defendant for 5 years.",
            knowledge="Claims the defendant was at his apartment watching a movie during the time of the robbery. Says they ordered pizza and the defendant didn't leave until after midnight.",
            bias="Friend of the defendant - may be motivated to provide false alibi",
            called_by=CaseRole.DEFENSE,
        ),
        Witness(
            name="Dr. Lisa Chen",
            background="Forensic expert specializing in video analysis. PhD in Computer Science, 10 years experience in digital forensics.",
            knowledge="Analyzed the security camera footage. Can testify about video quality, lighting conditions, and ability to make positive identification from the footage.",
            bias=None,
            called_by=CaseRole.DEFENSE,
        ),
    ]

    return Case(
        title="State v. Marcus Johnson",
        description="Armed robbery of a convenience store",
        charges=[
            "Armed Robbery in the First Degree",
            "Assault with a Deadly Weapon",
            "Theft in the Second Degree"
        ],
        case_facts="""On the evening of March 15, 2024, at approximately 10:47 PM, the QuickMart convenience store located at 1425 Oak Street was robbed. The perpetrator entered the store, approached the counter where clerk Sarah Martinez was working, and demanded money while threatening her with what appeared to be a knife.

The robber took $347 from the cash register and fled on foot. The entire incident was captured on the store's security camera system. Ms. Martinez immediately called 911, and police responded within 18 minutes.

At 11:45 PM, approximately 2 hours after the robbery, police officers found Marcus Johnson walking three blocks from the crime scene. When searched, Johnson was found to be in possession of $347 in cash - exactly the amount stolen from the store. He was arrested and charged with armed robbery, assault with a deadly weapon, and theft.

Johnson claims he was at his friend Michael Thompson's apartment during the time of the robbery, watching a movie. However, the prosecution argues that the security footage, eyewitness identification, and the cash found in his possession provide clear evidence of his guilt.""",
        prosecution_theory="The defendant Marcus Johnson committed armed robbery of the QuickMart convenience store. The evidence clearly shows that he entered the store at 10:47 PM, threatened the clerk with a weapon, and stole $347 from the register. He was identified by the victim, captured on security camera, and found with the exact amount of stolen cash. His alleged alibi is fabricated by a friend trying to help him avoid conviction.",
        defense_theory="Marcus Johnson is innocent of these charges. The security camera footage is of poor quality and cannot provide a reliable identification. The eyewitness identification is unreliable due to the traumatic nature of the event and poor lighting conditions. The cash found in Mr. Johnson's possession could have come from any source - it's common for people to carry cash. Most importantly, Mr. Johnson has a solid alibi - he was at his friend's apartment during the entire time period when the robbery occurred.",
        evidence=evidence,
        witnesses=witnesses,
        legal_precedents=[
            "United States v. Wade (1967) - Reliability of eyewitness identification",
            "Neil v. Biggers (1972) - Factors for evaluating identification reliability",
            "State v. Henderson (2011) - Standards for video evidence authentication",
        ],
    )
