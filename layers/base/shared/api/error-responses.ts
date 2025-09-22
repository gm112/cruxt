export interface error_response<cause_type = unknown> {
  /**
   * The type of error that occurred.
   * This is used to map the error message to a localized message.
   */
  error_key: string
  /**
   * A human-readable message that describes the error for debug purposes.
   */
  message?: string
  cause?: cause_type
}
