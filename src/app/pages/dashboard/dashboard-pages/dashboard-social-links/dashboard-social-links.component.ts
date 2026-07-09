import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { IContactUs } from "../../../../core/interfaces/dashboard/contact-us/IContactUs";
import { SocialLinksService } from "../../../../core/services/dashboard/content/social-links.service";
import { LoadingDataBannerComponent } from "../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { IUpdateSocialLinks } from "../../../../core/interfaces/dashboard/social-media/ISocialMedia";

@Component({
  selector: "app-dashboard-social-links",
  standalone: true,
  imports: [FormsModule, ButtonModule, MessagesModule, ToastModule, LoadingDataBannerComponent],
  templateUrl: "./dashboard-social-links.component.html",
  styleUrl: "./dashboard-social-links.component.scss",
  providers: [MessageService],
})
export class DashboardSocialLinksComponent {
  socialMediaLinks: any[] = [];
  originalLinks!: IContactUs;
  isLoading: boolean = false;

  constructor(private _SocialMediaService: SocialLinksService, private MessageService: MessageService) {}

  ngOnInit() {
    // Fetch social media links from the service
    this._SocialMediaService.getSocialMediaLinks().subscribe((response) => {
      if (response && response.rows) {
        this.socialMediaLinks = this.convertResponseToLinks(response.rows);
        this.originalLinks = JSON.parse(JSON.stringify(this.socialMediaLinks));
      }
    });
  }

  // Convert response to editable links array
  convertResponseToLinks(contact: any): any[] {
    return [
      {
        key: "tweet_link",
        label: "Twitter (EN)",
        icon: "pi-twitter",
        url: contact.tweet_link || "",
      },
      {
        key: "snap_link",
        label: "Snapchat (EN)",
        icon: "pi-comment",
        url: contact.snap_link || "",
      },
      {
        key: "insta_link",
        label: "Instagram (EN)",
        icon: "pi-instagram",
        url: contact.insta_link || "",
      },
      {
        key: "watus_link",
        label: "WhatsApp (EN)",
        icon: "pi-whatsapp",
        url: contact.watus_link || "",
      },
      {
        key: "face_link",
        label: "Facebook (EN)",
        icon: "pi-facebook",
        url: contact.face_link || "",
      },
      {
        key: "linked_link",
        label: "LinkedIn (EN)",
        icon: "pi-linkedin",
        url: contact.linked_link || "",
      },
      {
        key: "youtube_link",
        label: "YouTube (EN)",
        icon: "pi-youtube",
        url: contact.youtube_link || "",
      },
      {
        key: "map_link",
        label: "Location (EN)",
        icon: "pi-map-marker",
        url: contact.map_link || "",
      },
      {
        key: "en_address",
        label: "Address (EN)",
        icon: "pi-map-marker",
        url: contact.en_address || "",
      },
      {
        key: "ar_address",
        label: "العنوان (AR)",
        icon: "pi-map-marker",
        url: contact.ar_address || "",
      },
      {
        key: "main_email",
        label: "Email (EN)",
        icon: "pi-envelope",
        url: contact.main_email || "",
      },
      {
        key: "contat_first_phone",
        label: "First Phone (EN)",
        icon: "pi-phone",
        url: contact.contat_first_phone || "",
      },
      {
        key: "contact_second_phone",
        label: "Second Phone (EN)",
        icon: "pi-phone",
        url: contact.contact_second_phone || "",
      },
    ];
  }

  // Save changes by sending the full updated object
  saveChanges() {
    this.isLoading = true;
    const updatedLinks = this.convertLinksToRequestBody(this.socialMediaLinks);
    this._SocialMediaService.updateSocialMediaLinks(updatedLinks).subscribe((response) => {
      this.isLoading = false;
      this.MessageService.add({
        severity: "success",
        summary: "Success",
        detail: "Changes Saved Successfully",
      });
    });
  }

  // Convert links array back to request body format
  convertLinksToRequestBody(links: any[]): IUpdateSocialLinks {
    const requestBody: any = {
      id: 1, // Assuming this should remain constant or be dynamic
      en_address: "",
      ar_address: "",
      contact_text: "",
      en_meta_title: "",
      ar_meta_title: "",
      en_meta_text: "",
      ar_meta_text: "",
      tweet_link: "",
      snap_link: "",
      insta_link: "",
      watus_link: "",
      face_link: "",
      linked_link: "",
      youtube_link: "",
      map_link: "",
      main_email: "",
      contat_first_phone: "",
      contact_second_phone: "",
    };

    links.forEach((link) => {
      if (link.key in requestBody) {
        requestBody[link.key as keyof IUpdateSocialLinks] = link.url?.trim() || "";
      }
    });

    return requestBody;
  }
}
