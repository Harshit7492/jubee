import { useState, useRef, useEffect } from "react";
import {
  FileText,
  ArrowLeft,
  Upload,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Download,
  Save,
  File,
  ChevronDown,
  Lightbulb,
  RefreshCw,
  Type,
  AlignLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  FileUp,
  Scale,
  BookOpen,
  ArrowRight,
  Edit3,
  Home,
  Paperclip,
} from "lucide-react";
import jubeeLogo from '@/assets/jubee-logo.png';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { ToolNavigation } from "@/app/components/research-tools/ToolNavigation";
import { MySpacePickerDialog } from "@/app/components/MySpacePickerDialog";
import { JudgeSelectionModal } from "./JudgeSelectionModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DraftingToolProps {
  onBack: () => void;
  onToolChange?: (
    tool:
      | "research"
      | "drafting"
      | "translation"
      | "typing"
      | "draftsman"
      | "psi"
      | "cross-examiner",
    initialContent?: string,
  ) => void;
  activeTool?:
  | "research"
  | "drafting"
  | "translation"
  | "typing"
  | "draftsman"
  | "psi"
  | "cross-examiner";
}

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  category: "style" | "supporting" | "caselaw";
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  options?: Array<{ id: string; label: string; icon?: any }>;
  uploadPrompt?: {
    category: "style" | "supporting" | "caselaw";
    label: string;
    description: string;
    allowMultiple?: boolean;
    showReturnUserOption?: boolean;
  };
  inputPrompt?: {
    type: "text" | "textarea" | "select";
    placeholder: string;
    field: string;
    options?: string[];
    required?: boolean;
  };
  userSelection?: string;
  uploadedFiles?: UploadedDocument[];
  judgeChips?: string[];
}

type ConversationStage =
  | "intent"
  | "style-upload"
  | "supporting-upload"
  | "house-style-upload"
  | "supporting-legal-notice"
  | "caselaw-upload"
  | "client-name"
  | "counter-party"
  | "jurisdiction"
  | "judge-selection"
  | "relief"
  | "additional-details"
  | "generating"
  | "output";

const DOCUMENT_TYPES = [
  { id: "petition", label: "Petition", icon: FileText },
  { id: "reply", label: "Reply", icon: FileText },
  { id: "application", label: "Application", icon: FileText },
  { id: "legal-notice", label: "Legal Notice", icon: FileText },
  { id: "contract", label: "Contract", icon: FileText },
  {
    id: "written-argument",
    label: "Written Argument",
    icon: FileText,
  },
  {
    id: "counter-affidavit",
    label: "Counter Affidavit",
    icon: FileText,
  },
  { id: "other", label: "Other (Specify)", icon: Edit3 },
];

const COURTS = ["Supreme Court of India", "Delhi High Court"];

const JUDGES = [
  "Justice Sanjiv Khanna",
  "Justice B.R. Gavai",
  "Justice Surya Kant",
  "Justice Hrishikesh Roy",
  "Justice Abhay S. Oka",
  "Justice Prashant Kumar Mishra",
  "Other (Specify)",
];

export function DraftingTool({
  onBack,
  onToolChange,
  activeTool,
}: DraftingToolProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStage, setCurrentStage] =
    useState<ConversationStage>("intent");
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMySpaceDialogOpen, setIsMySpaceDialogOpen] =
    useState(false);
  const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);

  // Collected data
  const [selectedDocType, setSelectedDocType] = useState("");
  const [customDocType, setCustomDocType] = useState("");
  const [styleDoc, setStyleDoc] =
    useState<UploadedDocument | null>(null);
  const [supportingDocs, setSupportingDocs] = useState<
    UploadedDocument[]
  >([]);
  const [houseStyleDoc, setHouseStyleDoc] =
    useState<UploadedDocument | null>(null);
  const [caselawDocs, setCaselawDocs] = useState<
    UploadedDocument[]
  >([]);
  const [useLastBaseDraft, setUseLastBaseDraft] =
    useState(false);
  const [hasBaseDraftHistory, setHasBaseDraftHistory] =
    useState(true);
  const [clientName, setClientName] = useState("");
  const [counterPartyName, setCounterPartyName] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [judgeSelection, setJudgeSelection] = useState<string[]>([]);
  const [reliefSought, setReliefSought] = useState("");
  const [additionalDetails, setAdditionalDetails] =
    useState("");

  // Output phase
  const [generatedContent, setGeneratedContent] = useState("");
  const [showOutputView, setShowOutputView] = useState(false);
  const [isLeftPaneCollapsed, setIsLeftPaneCollapsed] =
    useState(false);
  const [showGeneratingLoader, setShowGeneratingLoader] = useState(false);

  // Typewriter effect state
  const [typingMessageId, setTypingMessageId] = useState<
    string | null
  >(null);
  const [visibleChars, setVisibleChars] = useState<
    Record<string, number>
  >({});

  // Formatting
  const [fontSize, setFontSize] = useState("12");
  const [lineSpacing, setLineSpacing] = useState("1.5");
  const [courtFormat, setCourtFormat] = useState("highcourt");
  const [wordCount, setWordCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUploadCategory = useRef<
    "style" | "supporting" | "caselaw"
  >("style");

  const courtFormats = [
    { id: "highcourt", name: "Delhi High Court" },
    { id: "supreme", name: "Supreme Court of India" },
  ];

  useEffect(() => {
    // Initial greeting
    addAIMessage(
      "What would you like to draft today?",
      DOCUMENT_TYPES.map((dt) => ({
        id: dt.id,
        label: dt.label,
        icon: dt.icon,
      })),
    );
  }, []);

  useEffect(() => {
    const words = generatedContent
      .trim()
      .split(/\\s+/)
      .filter((word) => word.length > 0);
    setWordCount(words.length);
  }, [generatedContent]);

  // Typewriter effect for AI messages
  useEffect(() => {
    if (typingMessageId) {
      const message = messages.find(
        (m) => m.id === typingMessageId,
      );
      if (!message || message.type !== "ai") {
        setTypingMessageId(null);
        return;
      }

      const fullText = message.content;
      const currentLength = visibleChars[typingMessageId] || 0;

      if (currentLength < fullText.length) {
        const timer = setTimeout(() => {
          setVisibleChars((prev) => ({
            ...prev,
            [typingMessageId]: currentLength + 1,
          }));
        }, 20); // Adjust speed here (lower = faster)

        return () => clearTimeout(timer);
      } else {
        // Typing complete for this message
        setTypingMessageId(null);
      }
    }
  }, [typingMessageId, visibleChars, messages]);

  const addAIMessage = (
    content: string,
    options?: Array<{ id: string; label: string; icon?: any }>,
    uploadPrompt?: ChatMessage["uploadPrompt"],
    inputPrompt?: ChatMessage["inputPrompt"],
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "ai",
      content,
      timestamp: new Date(),
      options,
      uploadPrompt,
      inputPrompt,
    };

    setMessages((prev) => [...prev, newMessage]);

    // Start typewriter effect for this message
    setTypingMessageId(newMessage.id);
    setVisibleChars((prev) => ({
      ...prev,
      [newMessage.id]: 0,
    }));
  };

  const addUserMessage = (
    content: string,
    selection?: string,
    files?: UploadedDocument[],
    judges?: string[],
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
      userSelection: selection,
      uploadedFiles: files,
      judgeChips: judges,
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionSelect = (
    optionId: string,
    optionLabel: string,
  ) => {
    setIsTyping(true);

    if (currentStage === "intent") {
      if (optionId === "other") {
        addUserMessage(`I want to draft: ${optionLabel}`);
        setTimeout(() => {
          setIsTyping(false);
          addAIMessage(
            "Please specify the type of document you want to draft.",
            undefined,
            undefined,
            {
              type: "text",
              placeholder:
                "E.g., Interlocutory Application, Rejoinder...",
              field: "customDocType",
              required: true,
            },
          );
          setCurrentStage("style-upload");
        }, 800);
      } else {
        setSelectedDocType(optionId);
        addUserMessage(`I want to draft a ${optionLabel}`);
        setTimeout(() => {
          setIsTyping(false);
          proceedToHouseStyle();
        }, 800);
      }
    }
  };

  const proceedToStyleUpload = () => {
    const docTypeName = selectedDocType
      ? DOCUMENT_TYPES.find((t) => t.id === selectedDocType)
        ?.label
      : customDocType;

    if (hasBaseDraftHistory) {
      // Skip style upload step and go directly to supporting docs
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocs();
      }, 800);
    } else {
      addAIMessage(
        `Perfect! Let's start drafting your ${docTypeName}. First, upload a similar document to match its style and format (optional).`,
        [
          {
            id: "upload-from-myspace",
            label: "Upload from My Space",
          },
          { id: "upload-style", label: "Upload New Document" },
          { id: "skip-style", label: "Skip This Step" },
        ],
        {
          category: "style",
          label: "Style Alignment Document",
          description:
            "Upload a similar document to match its style",
          allowMultiple: false,
          showReturnUserOption: hasBaseDraftHistory,
        },
      );
    }
    setCurrentStage("style-upload");
  };

  const handleStyleDocumentChoice = (choiceId: string) => {
    setIsTyping(true);

    if (choiceId === "upload-from-myspace") {
      addUserMessage(
        "I'll upload a style document from My Space",
      );
      setIsTyping(false);
      setIsMySpaceDialogOpen(true);
      currentUploadCategory.current = "style";
    } else if (
      choiceId === "upload-new" ||
      choiceId === "upload-style"
    ) {
      addUserMessage("I'll upload a new style document");
      currentUploadCategory.current = "style";
      fileInputRef.current?.click();
      setIsTyping(false);
    } else if (
      choiceId === "skip" ||
      choiceId === "skip-style"
    ) {
      addUserMessage("Skip style document");
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocs();
      }, 800);
    }
  };

  const proceedToSupportingDocs = () => {
    addAIMessage(
      "Upload any supporting documents that will help me draft your document.",
      [
        {
          id: "upload-from-myspace",
          label: "Upload from My Space",
        },
        {
          id: "upload-supporting",
          label: "Upload New Document",
        },
        { id: "skip-supporting", label: "Skip This Step" },
      ],
      {
        category: "supporting",
        label: "Supporting Documents",
        description: "Upload relevant documents",
        allowMultiple: true,
      },
    );
    setCurrentStage("supporting-upload");
  };

  const handleSupportingDocsChoice = (choiceId: string) => {
    setIsTyping(true);

    if (choiceId === "upload-from-myspace") {
      addUserMessage(
        "Upload supporting documents",
      );
      setIsTyping(false);
      setIsMySpaceDialogOpen(true);
      currentUploadCategory.current = "supporting";
    } else if (choiceId === "upload-supporting") {
      addUserMessage("Upload supporting documents");
      currentUploadCategory.current = "supporting";
      fileInputRef.current?.click();
      setIsTyping(false);
    } else if (choiceId === "skip-supporting") {
      addUserMessage("Skip supporting documents");
      setTimeout(() => {
        setIsTyping(false);
        proceedToCaselaws();
      }, 800);
    } else if (choiceId === "continue-supporting") {
      setTimeout(() => {
        setIsTyping(false);
        proceedToCaselaws();
      }, 500);
    }
  };

  const proceedToHouseStyle = () => {
    addAIMessage(
      "Please upload or add a house style draft for reference (Optional).",
      [
        {
          id: "upload-from-myspace",
          label: "Upload from My Space",
        },
        { id: "upload-house-style", label: "Upload New Document" },
        { id: "skip-house-style", label: "Skip This Step" },
      ],
      {
        category: "house-style",
        label: "House Style Document",
        description: "Upload house style document",
        allowMultiple: false,
      },
    );
    setCurrentStage("house-style-upload");
  };

  const handleHouseStyleChoice = (choiceId: string) => {
    setIsTyping(true);

    if (choiceId === "upload-from-myspace") {
      addUserMessage("I'll upload house style document from My Space");
      setIsTyping(false);
      setIsMySpaceDialogOpen(true);
      currentUploadCategory.current = "house-style";
    } else if (choiceId === "upload-house-style") {
      addUserMessage("I'll upload house style document");
      currentUploadCategory.current = "house-style";
      fileInputRef.current?.click();
      setIsTyping(false);
    } else if (choiceId === "skip-house-style") {
      addUserMessage("Skipped");
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocsForLegalNotice();
      }, 800);
    } else if (choiceId === "continue-house-style") {
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocsForLegalNotice();
      }, 500);
    }
  };

  const proceedToSupportingDocsForLegalNotice = () => {
    addAIMessage(
      "Upload supporting documents",
      [
        {
          id: "upload-from-myspace",
          label: "Upload from My Space",
        },
        {
          id: "upload-supporting-legal",
          label: "Upload New Document",
        },
        { id: "skip-supporting-legal", label: "Skip This Step" },
      ],
      {
        category: "supporting",
        label: "Supporting Documents",
        description: "Upload relevant documents",
        allowMultiple: true,
      },
    );
    setCurrentStage("supporting-legal-notice");
  };

  const handleSupportingDocsLegalNoticeChoice = (choiceId: string) => {
    setIsTyping(true);

    if (choiceId === "upload-from-myspace") {
      addUserMessage("Upload supporting documents from My Space");
      setIsTyping(false);
      setIsMySpaceDialogOpen(true);
      currentUploadCategory.current = "supporting";
    } else if (choiceId === "upload-supporting-legal") {
      addUserMessage("Upload supporting documents");
      currentUploadCategory.current = "supporting";
      fileInputRef.current?.click();
      setIsTyping(false);
    } else if (choiceId === "skip-supporting-legal") {
      addUserMessage("Skipped");
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStage("style-upload");
        proceedToStyleUpload();
      }, 800);
    } else if (choiceId === "continue-supporting-legal") {
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          "Your documents have been received. If there's anything else you'd like to add, feel free to share it in the chat box."
        );
        setCurrentStage("style-upload");
        proceedToStyleUpload();
      }, 500);
    }
  };

  const proceedToCaselaws = () => {
    addAIMessage(
      "Would you like to upload any case laws to ground the draft in legal authority?",
      [
        {
          id: "upload-from-myspace",
          label: "Upload from My Space",
        },
        { id: "upload-caselaw", label: "Upload New Document" },
        { id: "skip-caselaw", label: "Skip This Step" },
      ],
      {
        category: "caselaw",
        label: "Case Laws",
        description: "Upload case laws",
        allowMultiple: true,
      },
    );
    setCurrentStage("caselaw-upload");
  };

  const handleCaselawChoice = (choiceId: string) => {
    setIsTyping(true);

    if (choiceId === "upload-from-myspace") {
      addUserMessage("I'll upload case laws from My Space");
      setIsTyping(false);
      setIsMySpaceDialogOpen(true);
      currentUploadCategory.current = "caselaw";
    } else if (choiceId === "upload-caselaw") {
      addUserMessage("I'll upload case laws");
      currentUploadCategory.current = "caselaw";
      fileInputRef.current?.click();
      setIsTyping(false);
    } else if (choiceId === "skip-caselaw") {
      addUserMessage("Skip case laws");
      setTimeout(() => {
        setIsTyping(false);
        proceedToClientName();
      }, 800);
    } else if (choiceId === "continue-caselaw") {
      setTimeout(() => {
        setIsTyping(false);
        proceedToClientName();
      }, 500);
    }
  };

  const proceedToJurisdiction = () => {
    addAIMessage(
      "Which court or jurisdiction is this matter under?",
      COURTS.map((court) => ({ id: court, label: court })),
    );
    setCurrentStage("jurisdiction");
  };

  const proceedToJudgeSelection = () => {
    addAIMessage(
      "Please specify the judge for this matter (Optional).",
      [
        { id: "select-judges", label: "Select Judge(s)" },
        { id: "skip-judge", label: "Skip This Step" },
      ],
    );
    setCurrentStage("judge-selection");
  };

  const proceedToClientName = () => {
    addAIMessage(
      "Great! Now let's gather some details. What is your client's name?",
      undefined,
      undefined,
      {
        type: "text",
        placeholder: "Enter client name",
        field: "clientName",
        required: true,
      },
    );
    setCurrentStage("client-name");
  };

  const proceedToCounterParty = () => {
    addAIMessage(
      "What is the counter party's name?",
      [{ id: "skip-counter-party", label: "Skip for Now" }],
      undefined,
      {
        type: "text",
        placeholder: "Enter counter party name (optional)",
        field: "counterPartyName",
        required: false,
      },
    );
    setCurrentStage("counter-party");
  };

  const proceedToRelief = () => {
    addAIMessage(
      "Please describe the relief sought or claimed in this matter.",
      undefined,
      undefined,
      {
        type: "textarea",
        placeholder: "Describe the relief sought...",
        field: "reliefSought",
        required: true,
      },
    );
    setCurrentStage("relief");
  };

  const proceedToAdditionalDetails = () => {
    addAIMessage(
      "Your documents have been received. If there’s anything else you’d like to add, feel free to share it here.",
      [
        { id: "add-details", label: "Add Details" },
        { id: "skip-details", label: "Skip & Generate Draft" },
      ],
      undefined,
      {
        type: "textarea",
        placeholder: "Add any additional details...",
        field: "additionalDetails",
        required: false,
      },
    );
    setCurrentStage("additional-details");
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const category = currentUploadCategory.current;
    const newDocs: UploadedDocument[] = Array.from(files).map(
      (file, index) => ({
        id: `${category}-${Date.now()}-${index}`,
        name: file.name,
        type: file.type,
        category,
      }),
    );

    setIsTyping(true);

    if (category === "style") {
      setStyleDoc(newDocs[0]);
      addUserMessage(
        `Uploaded: ${newDocs[0].name}`,
        undefined,
        [newDocs[0]],
      );
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocs();
      }, 800);
    } else if (category === "supporting") {
      setSupportingDocs((prev) => [...prev, ...newDocs]);
      addUserMessage(
        `Uploaded ${newDocs.length} supporting document(s)`,
        undefined,
        newDocs,
      );
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          "Your documents have been received. If there's anything else you'd like to add, feel free to share it in the chat box.",
          undefined,
          undefined,
          {
            type: "text",
            placeholder: "Add any additional notes or skip by clicking send...",
            field: "supportingDocsNotes",
            required: false,
          },
        );
      }, 800);
    } else if (category === "house-style") {
      setHouseStyleDoc(newDocs[0]);
      addUserMessage(
        `Uploaded: ${newDocs[0].name}`,
        undefined,
        [newDocs[0]],
      );
      setTimeout(() => {
        setIsTyping(false);
        if (currentStage === "house-style-upload") {
          proceedToSupportingDocsForLegalNotice();
        } else {
          proceedToStyleUpload();
        }
      }, 800);
    } else if (category === "caselaw") {
      setCaselawDocs((prev) => [...prev, ...newDocs]);
      addUserMessage(
        `Uploaded ${newDocs.length} case law(s)`,
        undefined,
        newDocs,
      );
      setTimeout(() => {
        setIsTyping(false);
        proceedToClientName();
      }, 800);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleMySpaceSelect = (documents: any[]) => {
    if (documents.length === 0) return;

    const category = currentUploadCategory.current;
    const newDocs: UploadedDocument[] = documents.map(
      (doc, index) => ({
        id: `${category}-${Date.now()}-${index}`,
        name: doc.name,
        type: doc.type.toLowerCase(),
        category,
      }),
    );

    setIsTyping(true);
    setIsMySpaceDialogOpen(false);

    if (category === "style") {
      setStyleDoc(newDocs[0]);
      addUserMessage(
        `Uploaded from My Space: ${newDocs[0].name}`,
        undefined,
        [newDocs[0]],
      );
      setTimeout(() => {
        setIsTyping(false);
        proceedToSupportingDocs();
      }, 800);
    } else if (category === "supporting") {
      setSupportingDocs((prev) => [...prev, ...newDocs]);
      addUserMessage(
        `Uploaded ${newDocs.length} supporting document(s) from My Space`,
        undefined,
        newDocs,
      );
      setTimeout(() => {
        setIsTyping(false);
        addAIMessage(
          "Your documents have been received. If there's anything else you'd like to add, feel free to share it in the chat box.",
          undefined,
          undefined,
          {
            type: "text",
            placeholder: "Add any additional notes or skip by clicking send...",
            field: "supportingDocsNotes",
            required: false,
          },
        );
      }, 800);
    } else if (category === "house-style") {
      setHouseStyleDoc(newDocs[0]);
      addUserMessage(
        `Uploaded from My Space: ${newDocs[0].name}`,
        undefined,
        [newDocs[0]],
      );
      setTimeout(() => {
        setIsTyping(false);
        if (currentStage === "house-style-upload") {
          proceedToSupportingDocsForLegalNotice();
        } else {
          proceedToStyleUpload();
        }
      }, 800);
    } else if (category === "caselaw") {
      setCaselawDocs((prev) => [...prev, ...newDocs]);
      addUserMessage(
        `Uploaded ${newDocs.length} case law(s) from My Space`,
        undefined,
        newDocs,
      );
      setTimeout(() => {
        setIsTyping(false);
        proceedToClientName();
      }, 800);
    }
  };

  const handleInputSubmit = (field: string, value: string) => {
    if (
      !value.trim() &&
      currentStage !== "counter-party" &&
      currentStage !== "additional-details" &&
      currentStage !== "judge-selection" &&
      field !== "supportingDocsNotes"
    ) {
      toast.error("This field is required");
      return;
    }

    setIsTyping(true);
    addUserMessage(value || "(Skipped)");

    if (field === "customDocType") {
      setCustomDocType(value);
      setTimeout(() => {
        setIsTyping(false);
        proceedToStyleUpload();
      }, 800);
    } else if (field === "clientName") {
      setClientName(value);
      setTimeout(() => {
        setIsTyping(false);
        proceedToCounterParty();
      }, 800);
    } else if (field === "counterPartyName") {
      setCounterPartyName(value);
      setTimeout(() => {
        setIsTyping(false);
        proceedToJurisdiction();
      }, 800);
    } else if (field === "customJudge") {
      setJudgeSelection([value]);
      setTimeout(() => {
        setIsTyping(false);
        proceedToRelief();
      }, 800);
    } else if (field === "reliefSought") {
      setReliefSought(value);
      setTimeout(() => {
        setIsTyping(false);
        proceedToAdditionalDetails();
      }, 800);
    } else if (field === "additionalDetails") {
      setAdditionalDetails(value);
      setTimeout(() => {
        setIsTyping(false);
        generateDraft();
      }, 800);
    } else if (field === "supportingDocsNotes") {
      // User provided additional notes about supporting documents
      setTimeout(() => {
        setIsTyping(false);
        proceedToCaselaws();
      }, 800);
    }
  };

  const handleJurisdictionSelect = (court: string) => {
    setIsTyping(true);
    setJurisdiction(court);
    addUserMessage(court);

    setTimeout(() => {
      setIsTyping(false);
      proceedToJudgeSelection();
    }, 800);
  };

  const handleJudgeSelection = (choiceId: string) => {
    if (choiceId === "select-judges") {
      setIsJudgeModalOpen(true);
    } else if (choiceId === "skip-judge") {
      addUserMessage("Skip judge selection");
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        proceedToRelief();
      }, 800);
    }
  };

  const handleJudgeModalConfirm = (selectedJudges: string[]) => {
    if (selectedJudges.length > 0) {
      setJudgeSelection(selectedJudges);

      // Create chips display in chat
      addUserMessage(
        `Selected ${selectedJudges.length} judge${selectedJudges.length > 1 ? 's' : ''}`,
        undefined,
        undefined,
        selectedJudges
      );

      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        proceedToRelief();
      }, 800);
    }
  };

  const generateDraft = () => {
    addAIMessage(
      "Perfect! I have all the information I need. Let me generate your draft now...",
    );
    setCurrentStage("generating");
    setIsTyping(true);

    // Show generating loader after typing animation
    setTimeout(() => {
      setIsTyping(false);
      setShowGeneratingLoader(true);
    }, 800);

    // Show results after 3 seconds total (800ms typing + 2200ms loader)
    setTimeout(() => {
      const docTypeName = selectedDocType
        ? DOCUMENT_TYPES.find((t) => t.id === selectedDocType)
          ?.label
        : customDocType;

      const content = `IN THE ${jurisdiction.toUpperCase()}

${docTypeName?.toUpperCase()} NO. _____ OF 2026

IN THE MATTER OF:

${clientName}
...Petitioner/Applicant

VERSUS

${counterPartyName || "[Name of Counter Party]"}
...Respondent

WRITTEN SUBMISSIONS ON BEHALF OF THE PETITIONER

1. JURISDICTION & MAINTAINABILITY

   1.1 This Hon'ble Court has territorial and pecuniary jurisdiction to entertain the present ${docTypeName?.toLowerCase()} under Article 226 of the Constitution of India.

   1.2 The ${docTypeName?.toLowerCase()} is maintainable as the impugned action directly affects the fundamental rights of the petitioner guaranteed under Articles 14, 19, and 21 of the Constitution.

   1.3 The petitioner has approached this Hon'ble Court as a matter of last resort, having exhausted all alternative remedies available under the law.

2. FACTUAL BACKGROUND

   2.1 The petitioner, ${clientName}, is a law-abiding citizen engaged in legitimate activities and has been adversely affected by the arbitrary action of the respondent${counterPartyName ? ", " + counterPartyName : ""}.

   2.2 Despite following all prescribed procedures and providing all requisite documentation, the respondent passed the impugned order dated ${new Date().toLocaleDateString("en-IN")} without affording adequate opportunity of hearing.

   2.3 ${additionalDetails || "The impugned order suffers from patent illegality and is in gross violation of the principles of natural justice."}

3. RELIEF SOUGHT

   3.1 ${reliefSought}

   3.2 The petitioner humbly submits that the relief sought is just, equitable, and in accordance with the established principles of law as laid down by this Hon'ble Court and the Hon'ble Supreme Court.

4. VIOLATION OF NATURAL JUSTICE

   4.1 It is a fundamental principle of law that no person shall be condemned unheard. This principle is embodied in the maxim "audi alteram partem" (hear the other side).

   4.2 In the landmark judgment of Maneka Gandhi v. Union of India (1978) 1 SCC 248, the Hon'ble Supreme Court held that the principles of natural justice are an integral part of Article 21 of the Constitution.

   4.3 The respondent failed to provide adequate notice and opportunity of hearing to the petitioner before passing the impugned order, thereby violating the settled principles laid down by this Hon'ble Court.

   4.4 The impugned order does not reflect any consideration of the detailed submissions made by the petitioner, indicating complete non-application of mind.

5. ARBITRARY AND UNREASONABLE ACTION

   5.1 The impugned action is arbitrary, unreasonable, and violative of Article 14 of the Constitution of India, which guarantees equality before law and equal protection of laws.

   5.2 In State of Andhra Pradesh v. McDowell & Co. (1996) 3 SCC 709, it was held that every state action must be informed by reason and guided by public interest.

   5.3 The respondent has acted in a mechanical manner without considering the material facts and circumstances of the case, rendering the impugned order liable to be set aside.

6. LEGAL GROUNDS FOR INTERFERENCE

   6.1 This Hon'ble Court, in exercise of its powers under Article 226 of the Constitution, has the jurisdiction to interfere where administrative action is arbitrary, unreasonable, or violates principles of natural justice.

   6.2 The impugned order is liable to be quashed on the following grounds:
        (a) Violation of principles of natural justice
        (b) Non-application of mind to material facts
        (c) Arbitrary and unreasonable exercise of power
        (d) Failure to consider relevant material

7. BALANCE OF CONVENIENCE

   7.1 The balance of convenience lies entirely in favor of the petitioner. The petitioner will suffer irreparable loss and injury if the impugned order is allowed to operate.

   7.2 On the other hand, the respondent will not suffer any prejudice if the impugned order is stayed or quashed, as justice and equity demand interference by this Hon'ble Court.

8. PRAYER FOR RELIEF

   8.1 In light of the foregoing submissions and the settled legal position, it is most respectfully prayed that this Hon'ble Court may be pleased to:

        (a) ${reliefSought};

        (b) Pass such other or further orders as this Hon'ble Court may deem fit and proper in the facts and circumstances of the case.

9. CONCLUSION

   The petitioner has a strong prima facie case, and the balance of convenience lies entirely in favor of the petitioner. The petitioner will suffer irreparable loss if the reliefs prayed for are not granted. It is, therefore, most respectfully prayed that this Hon'ble Court may be pleased to allow the present ${docTypeName?.toLowerCase()}.


PLACE: New Delhi
DATE: ${new Date().toLocaleDateString("en-IN")}

Respectfully submitted,

[Advocate Name]
[Enrollment Number]
Advocate for the Petitioner`;

      setGeneratedContent(content);
      setIsTyping(false);
      setShowGeneratingLoader(false);
      setShowOutputView(true);
      setCurrentStage("output");

      addAIMessage(
        `I've successfully generated your ${docTypeName}! You can now view it, make refinements, download it, save it to My Space, or send it to Jubee Counsel for detailed editing.`,
        [{ id: "view-draft", label: "View Draft" }],
      );
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Find the last AI message to determine context
    const lastAIMessage = [...messages]
      .reverse()
      .find((m) => m.type === "ai");

    if (lastAIMessage?.inputPrompt) {
      handleInputSubmit(
        lastAIMessage.inputPrompt.field,
        inputValue,
      );
      setInputValue("");
    } else if (currentStage === "output") {
      // Refinement chat
      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        type: "user",
        content: inputValue,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");
      setIsTyping(true);

      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content:
            "I understand your request. Let me refine that section for you...",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleDownloadDraft = () => {
    const blob = new Blob([generatedContent], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedDocType || customDocType}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Draft downloaded successfully");
  };

  const handleSaveToMySpace = () => {
    setIsMySpaceDialogOpen(true);
  };

  const handleSendToDraftsman = () => {
    toast.success(
      "Draft sent to Jubee Counsel for detailed editing",
    );
    if (onToolChange) {
      onToolChange("draftsman", generatedContent);
    }
  };

  const handleStartOver = () => {
    setMessages([]);
    setCurrentStage("intent");
    setSelectedDocType("");
    setCustomDocType("");
    setStyleDoc(null);
    setSupportingDocs([]);
    setCaselawDocs([]);
    setUseLastBaseDraft(false);
    setClientName("");
    setCounterPartyName("");
    setJurisdiction("");
    setJudgeSelection([]);
    setReliefSought("");
    setAdditionalDetails("");
    setGeneratedContent("");
    setShowOutputView(false);
    setInputValue("");

    setTimeout(() => {
      addAIMessage(
        "Hello! I'm your AI Drafting Assistant. I'll help you create professional legal documents. What do you want to draft today?",
        DOCUMENT_TYPES.map((dt) => ({
          id: dt.id,
          label: dt.label,
          icon: dt.icon,
        })),
      );
    }, 100);
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Render conversation view or output view
  if (showGeneratingLoader) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="drafting"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        {/* Generating Loader Screen */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6">
            {/* Animated AI Icon */}
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="absolute inset-0 w-20 h-20 border-4 border-primary/30 rounded-2xl animate-spin" style={{ animationDuration: '3s' }}></div>
            </div>

            {/* Loading Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                Generating Your Draft
              </h3>
              <p className="text-muted-foreground">
                AI is analyzing your inputs and crafting the document...
              </p>
            </div>

            {/* Loading Dots */}
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showOutputView && currentStage === "output") {
    return (
      <div className="flex flex-col h-screen bg-background">
        <ToolNavigation
          currentTool="drafting"
          onToolChange={onToolChange}
          onBack={onBack}
          activeTool={activeTool}
        />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Document Preview */}
          <div
            className={`bg-card border-r border-border flex flex-col transition-all duration-300 ${isLeftPaneCollapsed ? "w-0" : "w-1/2"
              }`}
          >
            {!isLeftPaneCollapsed && (
              <>
                {/* Document Header */}
                <div className="border-b border-border p-4 flex items-center justify-between bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
                        Generated Draft
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {wordCount} words
                      </p>
                    </div>
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-2">
                    {/* Font Size */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Type className="w-4 h-4" />
                          <span className="text-xs">
                            {fontSize}pt
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {[
                          "10",
                          "11",
                          "12",
                          "13",
                          "14",
                          "16",
                        ].map((size) => (
                          <DropdownMenuItem
                            key={size}
                            onClick={() => setFontSize(size)}
                          >
                            {size}pt
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Line Spacing */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <AlignLeft className="w-4 h-4" />
                          <span className="text-xs">
                            {lineSpacing}
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {["1.0", "1.5", "2.0"].map(
                          (spacing) => (
                            <DropdownMenuItem
                              key={spacing}
                              onClick={() =>
                                setLineSpacing(spacing)
                              }
                            >
                              {spacing}
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Court Format */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1"
                        >
                          <Scale className="w-4 h-4" />
                          <span className="text-xs hidden lg:inline">
                            {
                              courtFormats.find(
                                (f) => f.id === courtFormat,
                              )?.name
                            }
                          </span>
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {courtFormats.map((format) => (
                          <DropdownMenuItem
                            key={format.id}
                            onClick={() =>
                              setCourtFormat(format.id)
                            }
                          >
                            {format.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="w-px h-6 bg-border" />

                    <Button
                      onClick={handleDownloadDraft}
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      <Download className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={handleSaveToMySpace}
                      variant="ghost"
                      size="sm"
                      className="h-8"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Document Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="bg-white text-black min-h-full p-12 rounded-lg shadow-sm focus:outline-none"
                    style={{
                      fontSize: `${fontSize}pt`,
                      lineHeight: lineSpacing,
                      fontFamily: "Times New Roman, serif",
                    }}
                  >
                    {generatedContent}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() =>
              setIsLeftPaneCollapsed(!isLeftPaneCollapsed)
            }
            className="w-8 bg-card border-r border-border hover:bg-accent transition-colors flex items-center justify-center"
          >
            {isLeftPaneCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Right Pane: Chat Interface */}
          <div className="flex-1 flex flex-col bg-background relative">
            {/* Chat Header */}
            <div className="border-b border-border p-4 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      AI Drafting Assistant
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-xs mt-1"
                    >
                      History saved for future reference
                    </Badge>
                  </div>
                </div>

                <Button
                  onClick={handleStartOver}
                  variant="outline"
                  size="sm"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-border p-4 bg-muted/30">
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={handleDownloadDraft}
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={handleSaveToMySpace}
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleSendToDraftsman}
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 font-semibold"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Jubee Counsel
                </Button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32">
              <div className="min-h-full flex flex-col justify-end">
                <div className="space-y-4 pb-2">
                  {messages.map((message) => (
                    <div key={message.id}>
                      {/* Message Bubble */}
                      <div
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "ai" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.type === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border text-foreground"
                            }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>

                          {/* Show uploaded files */}
                          {message.uploadedFiles &&
                            message.uploadedFiles.length >
                            0 && (
                              <div className="mt-2 space-y-1">
                                {message.uploadedFiles.map(
                                  (file) => (
                                    <div
                                      key={file.id}
                                      className="flex items-center gap-2 text-xs opacity-80"
                                    >
                                      <File className="w-3 h-3" />
                                      <span>{file.name}</span>
                                    </div>
                                  ),
                                )}
                              </div>
                            )}

                          {/* Show selected judges as chips */}
                          {message.judgeChips &&
                            message.judgeChips.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {message.judgeChips.map((judge, idx) => (
                                  <div
                                    key={idx}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 rounded-lg text-xs text-white"
                                  >
                                    <Scale className="w-3 h-3 text-[#1E3A8A]" />
                                    <span>Hon'ble Justice {judge}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                        {message.type === "user" && (
                          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-card border border-border rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} className="h-4" />
                </div>
              </div>
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="border-t border-border bg-background/95 backdrop-blur-sm px-8 py-6 flex-shrink-0 sticky bottom-0">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <Input
                    value={inputValue}
                    onChange={(e) =>
                      setInputValue(e.target.value)
                    }
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleSendMessage()
                    }
                    placeholder="Ask me to refine or modify the draft..."
                    className="w-full h-14 pl-6 pr-14 text-base bg-card border-2 border-border rounded-2xl focus:border-primary text-foreground"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="icon"
                    className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Space Picker Dialog */}
        {isMySpaceDialogOpen && (
          <MySpacePickerDialog
            isOpen={isMySpaceDialogOpen}
            onClose={() => setIsMySpaceDialogOpen(false)}
            onSelect={handleMySpaceSelect}
          />
        )}

        {/* Judge Selection Modal */}
        <JudgeSelectionModal
          isOpen={isJudgeModalOpen}
          onClose={() => setIsJudgeModalOpen(false)}
          onConfirm={handleJudgeModalConfirm}
        />
      </div>
    );
  }

  // Main conversation view
  return (
    <div className="flex flex-col h-screen bg-background">
      <ToolNavigation
        currentTool="drafting"
        onToolChange={onToolChange}
        onBack={onBack}
        activeTool={activeTool}
      />

      {/* Conversation Container */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-secondary/50 border-b border-border px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Author
              </h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-8 pb-40 flex flex-col-reverse">
          <div className="space-y-6 flex flex-col">
            {messages.map((message, index) => (
              <div key={message.id}>
                {/* Message Bubble */}
                <div
                  className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.type === "ai" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 ${message.type === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground shadow-sm"
                      }`}
                  >
                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                      {message.type === "ai"
                        ? message.content.slice(
                          0,
                          visibleChars[message.id] ||
                          message.content.length,
                        )
                        : message.content}
                    </p>

                    {/* Show uploaded files */}
                    {message.uploadedFiles &&
                      message.uploadedFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.uploadedFiles.map((file) => (
                            <div
                              key={file.id}
                              className="flex items-center gap-2 text-sm bg-primary-foreground/10 rounded-lg px-3 py-2"
                            >
                              <File className="w-4 h-4" />
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Show selected judges as chips */}
                    {message.judgeChips &&
                      message.judgeChips.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {message.judgeChips.map((judge, idx) => (
                            <div
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A8A]/20 border border-[#1E3A8A]/40 rounded-lg text-sm text-white"
                            >
                              <Scale className="w-3.5 h-3.5 text-[#1E3A8A]" />
                              <span>Hon'ble Mr./Ms. Justice {judge}</span>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  {message.type === "user" && (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                {/* Options (Chips) */}
                {message.type === "ai" &&
                  message.options &&
                  index === messages.length - 1 &&
                  !isTyping &&
                  typingMessageId !== message.id && (
                    <div className="ml-16 mt-4 flex flex-wrap gap-2">
                      {message.options.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.id}
                            onClick={() => {
                              if (currentStage === "intent") {
                                handleOptionSelect(
                                  option.id,
                                  option.label,
                                );
                              } else if (
                                currentStage === "style-upload"
                              ) {
                                handleStyleDocumentChoice(
                                  option.id,
                                );
                              } else if (
                                currentStage ===
                                "supporting-upload"
                              ) {
                                handleSupportingDocsChoice(
                                  option.id,
                                );
                              } else if (
                                currentStage ===
                                "house-style-upload"
                              ) {
                                handleHouseStyleChoice(
                                  option.id,
                                );
                              } else if (
                                currentStage ===
                                "supporting-legal-notice"
                              ) {
                                handleSupportingDocsLegalNoticeChoice(
                                  option.id,
                                );
                              } else if (
                                currentStage ===
                                "caselaw-upload"
                              ) {
                                handleCaselawChoice(option.id);
                              } else if (
                                currentStage === "counter-party"
                              ) {
                                if (
                                  option.id ===
                                  "skip-counter-party"
                                ) {
                                  addUserMessage(
                                    "Skip counter party name",
                                  );
                                  setIsTyping(true);
                                  setTimeout(() => {
                                    setIsTyping(false);
                                    proceedToJurisdiction();
                                  }, 800);
                                }
                              } else if (
                                currentStage === "jurisdiction"
                              ) {
                                handleJurisdictionSelect(
                                  option.id,
                                );
                              } else if (
                                currentStage ===
                                "judge-selection"
                              ) {
                                handleJudgeSelection(option.id);
                              } else if (
                                currentStage ===
                                "additional-details"
                              ) {
                                if (
                                  option.id === "skip-details"
                                ) {
                                  addUserMessage(
                                    "Skip additional details",
                                  );
                                  setIsTyping(true);
                                  setTimeout(() => {
                                    setIsTyping(false);
                                    generateDraft();
                                  }, 800);
                                }
                              } else if (
                                currentStage === "output" &&
                                option.id === "view-draft"
                              ) {
                                // Already showing the draft
                              }
                            }}
                            className="px-4 py-2.5 bg-card hover:bg-primary/10 border-2 border-border hover:border-primary rounded-xl transition-all hover:shadow-md flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary"
                          >
                            {Icon && (
                              <Icon className="w-4 h-4" />
                            )}
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <img src={jubeeLogo} alt="Jubee AI" className="w-6 h-6 object-contain" />
                </div>
                <div className="bg-card border border-border rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="absolute bottom-6 left-0 right-0 border-t border-border bg-background/95 backdrop-blur-sm px-6 py-6 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  handleSendMessage()
                }
                placeholder={
                  [...messages]
                    .reverse()
                    .find((m) => m.type === "ai")
                    ?.inputPrompt &&
                    ![...messages]
                      .reverse()
                      .find((m) => m.type === "ai")?.options
                      ?.length
                    ? `${[...messages].reverse().find((m) => m.type === "ai")?.inputPrompt?.placeholder || "Type your answer here..."} ✍️`
                    : "Type your message here..."
                }
                className={`w-full h-16 pl-6 pr-28 text-base rounded-2xl transition-all duration-300 ${[...messages]
                  .reverse()
                  .find((m) => m.type === "ai")
                  ?.inputPrompt &&
                  ![...messages]
                    .reverse()
                    .find((m) => m.type === "ai")?.options
                    ?.length
                  ? "bg-primary/5 border-2 border-primary shadow-lg shadow-primary/20 animate-pulse"
                  : "bg-card border-2 border-border focus:border-primary"
                  } text-foreground`}
              />
              <div className="absolute right-2 top-3 flex items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-xl hover:bg-accent"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() && !isTyping}
                  size="icon"
                  className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* My Space Picker Dialog */}
      {isMySpaceDialogOpen && (
        <MySpacePickerDialog
          isOpen={isMySpaceDialogOpen}
          onClose={() => setIsMySpaceDialogOpen(false)}
          onSelect={handleMySpaceSelect}
        />
      )}

      {/* Judge Selection Modal */}
      <JudgeSelectionModal
        isOpen={isJudgeModalOpen}
        onClose={() => setIsJudgeModalOpen(false)}
        onConfirm={handleJudgeModalConfirm}
      />
    </div>
  );
}