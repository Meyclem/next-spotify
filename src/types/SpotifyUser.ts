export type SpotifyUser = {
  accessToken: string;
  display_name: string;
  email?: string;
  explicit_content?: Record<string, unknown>;
  external_urls?: Record<string, unknown>;
  followers?: Record<string, unknown>;
  href?: string;
  id?: string;
  images?: Record<string, unknown>[];
  product?: string;
  type?: string;
  uri?: string;
};
