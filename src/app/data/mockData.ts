export const sessionConversations: Record<string, any> = {
  "1": [
    {
      id: "m1",
      type: "user",
      content: "I need to research Section 138 NI Act precedents for a dishonored cheque case",
      timestamp: new Date(Date.now() - 7200000),
    },
    {
      id: "m2",
      type: "ai",
      content: "I found relevant Supreme Court precedents on this topic. Here are the key cases:",
      timestamp: new Date(Date.now() - 7190000),
      cases: [
        {
          name: "Rangappa v. Sri Mohan",
          citation: "(2010) 11 SCC 441",
          summary: "Landmark judgment establishing burden of proof in Section 138 NI Act cases. Once dishonor is proved, burden shifts to the accused.",
        },
        {
          name: "Kumar Exports v. Sharma Carpets",
          citation: "(2009) 2 SCC 513",
          summary: "Clarified the limitation period for filing complaints under Section 138 of the Negotiable Instruments Act.",
        },
        {
          name: "M.M.T.C. Ltd. v. Medchl Chemicals",
          citation: "(2002) 1 SCC 234",
          summary: "Explained the statutory presumption under Section 139 regarding consideration for cheque issuance.",
        },
      ],
    },
  ],
  "2": [
    {
      id: "m1",
      type: "user",
      content: "Draft a bail application for anticipatory bail in a Section 420 IPC case",
      timestamp: new Date(Date.now() - 18000000),
    },
  ],
  "3": [
    {
      id: "m1",
      type: "user",
      content: "I have a High Court judgment in Hindi that I need translated to English. Let me upload it.",
      timestamp: new Date(Date.now() - 86400000),
    },
  ],
};
