import { resumeSchema, type Resume } from "./schema";

const resumeRaw: Resume = {
  summary:
    "Site Reliability Engineer at Loft working across SRE, platform engineering, developer experience, and LLMOps. I build self-service platforms, standardize multi-cluster Kubernetes environments, enforce GitOps and infrastructure-as-code governance, improve incident response, and optimize AWS infrastructure costs.",
  entries: [
    {
      company: "Loft",
      role: "Mid-Level Site Reliability Engineer",
      startDate: "2024-03",
      endDate: "present",
      location: "São Paulo, Brazil",
      responsibilities: [
        "Drive multi-cluster Kubernetes standardization, self-service platform engineering, GitOps and infrastructure-as-code governance, and cloud cost optimization across AWS environments.",
        "Provide tier-3 incident response and on-call support across Kubernetes, PostgreSQL on RDS, AWS IAM, SQS, and Datadog pipelines.",
        "Govern API traffic infrastructure with Kong API Gateway, including architecture reviews, external routing, and JWT authentication middleware.",
      ],
      engineeringWork: [
        "Engineered an automated application bootstrap platform with GitHub Actions, Terraform, Terragrunt, and HashiCorp Vault for SPA, Kotlin, and microservice architectures.",
        "Lead the multi-phase migration and architectural standardization of 24 EKS clusters for stronger isolation, security governance, and granular FinOps tracking.",
        "Architected and benchmarked a self-hosted open-weight LLM inference platform on EKS with NVIDIA GPUs, Karpenter, Knative, KServe, vLLM, and Bifrost.",
      ],
      impact: [
        "Reduced application onboarding and infrastructure provisioning time by 90%, from four hours to approximately 20 minutes.",
        "Reduced global Datadog costs by approximately 10% by replacing default non-production agents with opt-in log and metric ingestion.",
        "Evaluated serverless scale-to-zero behavior to reduce the unit economics of self-hosted LLM inference.",
      ],
      technologies: [
        "AWS",
        "Bifrost",
        "Datadog",
        "EKS",
        "GitHub Actions",
        "HashiCorp Vault",
        "Karpenter",
        "Knative",
        "Kong",
        "KServe",
        "Kubernetes",
        "PostgreSQL",
        "SQS",
        "Terraform",
        "Terragrunt",
        "vLLM",
      ],
    },
    {
      company: "Loft",
      role: "Junior Site Reliability Engineer",
      startDate: "2023-03",
      endDate: "2024-03",
      location: "São Paulo, Brazil",
      progression: "Progressed from Machine Learning Engineer into Site Reliability Engineering.",
      responsibilities: [
        "Maintained cloud infrastructure, continuous delivery automation, Kubernetes workloads, and operational tooling for product engineering teams.",
        "Supported product squads with Datadog observability, AWS IAM permissions, Kong API routing, and database connectivity.",
      ],
      engineeringWork: [
        "Led the migration of Finance development workloads from EC2 and Jenkins to EKS using Argo CD-based GitOps workflows.",
        "Maintained and scaled containerized workloads with Argo CD, Helm, and GitHub Actions pipelines.",
        "Built internal scripts and CLI automations for cloud resource provisioning.",
      ],
      impact: [
        "Modernized Finance development workloads by moving them from legacy compute and delivery systems to EKS and GitOps.",
        "Reduced manual operational toil for engineering squads through self-service automation.",
      ],
      technologies: [
        "Argo CD",
        "AWS",
        "Datadog",
        "EC2",
        "EKS",
        "GitHub Actions",
        "Helm",
        "Jenkins",
        "Kong",
        "Kubernetes",
      ],
    },
    {
      company: "Loft",
      role: "Machine Learning Engineer",
      startDate: "2022-05",
      endDate: "2023-03",
      location: "São Paulo, Brazil",
      progression: "Moved from data science into production machine learning and MLOps.",
      responsibilities: [
        "Managed production MLOps lifecycles with low-latency inference, model drift monitoring, and availability requirements.",
        "Provisioned and operated scalable AWS SageMaker training infrastructure for data science teams.",
      ],
      engineeringWork: [
        "Supported production deployment and API integration of proprietary automated valuation models into Loft's microservices architecture.",
        "Automated machine learning training infrastructure and model lifecycle operations.",
      ],
      impact: [
        "Enabled data scientists to iterate on experiments and model training using managed, scalable infrastructure.",
        "Helped productize real-estate valuation models for use in Loft's core services.",
      ],
      technologies: ["AWS", "Machine Learning", "MLOps", "Python", "SageMaker"],
    },
    {
      company: "Loft",
      role: "Junior Data Scientist",
      startDate: "2021-06",
      endDate: "2022-07",
      location: "São Paulo, Brazil",
      progression: "Progressed from Data Science Intern to Junior Data Scientist.",
      responsibilities: [
        "Developed statistical and machine learning models for real-estate valuation, comparative market analysis, and automated pricing.",
        "Built Python and SQL pipelines for transactional and geospatial feature extraction and transformation.",
      ],
      engineeringWork: [
        "Designed, trained, and validated production valuation models using property registry data, market listings, and geospatial features.",
        "Established statistical metrics and automated dashboards for valuation accuracy, price variance, and model performance.",
      ],
      impact: [
        "Contributed to the production valuation models Robson, Leia, Amadeu, and David.",
        "Established automated quality controls for monitoring valuation performance over time.",
      ],
      technologies: ["Data Science", "Machine Learning", "Python", "SQL", "Statistics"],
    },
    {
      company: "Loft",
      role: "Data Science Intern",
      startDate: "2020-02",
      endDate: "2021-06",
      location: "São Paulo, Brazil",
      progression: "Continued at Loft after the Summer Internship program.",
      responsibilities: [
        "Built and optimized Python and SQL pipelines for transactional and geospatial data.",
        "Supported predictive-model validation, testing, and monitoring for real-estate valuation.",
      ],
      engineeringWork: [
        "Created automated dashboards and exploratory analyses for product and business teams.",
        "Extracted, cleaned, and transformed corporate data into features for machine learning models.",
      ],
      impact: [
        "Supported data-driven product decisions and the development of automated valuation models.",
      ],
      technologies: ["Data Analysis", "Machine Learning", "Python", "SQL"],
    },
    {
      company: "Loft",
      role: "Data Science Summer Intern",
      startDate: "2019-12",
      endDate: "2020-02",
      location: "São Paulo, Brazil",
      responsibilities: [
        "Explored large-scale property datasets to identify market trends and data anomalies.",
        "Supported A/B test design and predictive experiments around real-estate pricing features.",
      ],
      engineeringWork: [
        "Conducted exploratory data analysis for property datasets in collaboration with data engineering and product teams.",
      ],
      impact: ["Selected for Loft's competitive Summer Internship program."],
      technologies: ["A/B Testing", "Data Analysis", "Machine Learning", "Python"],
    },
    {
      company: "Grupo Turing",
      role: "Machine Learning Researcher",
      startDate: "2019-09",
      endDate: "2020-03",
      location: "São Paulo, Brazil",
      responsibilities: ["Conducted machine learning research as part of Grupo Turing."],
      engineeringWork: [],
      impact: [],
      technologies: ["Machine Learning"],
    },
  ],
};

export const resume: Resume = resumeSchema.parse(resumeRaw);
